import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getGames } from '../utils/api';
import GameCard from '../components/GameCard';
import SkeletonCard from '../components/SkeletonCard';
import BasketballImage from '../assets/images/basketball_1.jpg';

const STATUS_FILTERS = [
  { label: 'Upcoming', value: 'scheduled' },
  { label: 'Live', value: 'inProgress' },
  { label: 'Completed', value: 'final' },
];

type RootStackParamList = {
  Dashboard: undefined;
  GameDetail: { gameId: string };
};

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

const DashboardScreen = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [statusFilter, setStatusFilter] = useState('scheduled');
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const loadGames = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getGames();
      setGames(data);
    } catch {
      setError('Failed to load games');
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getGames();
        setGames(data);
      } catch {
        setError('Failed to load games');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const filteredGames = games.filter(game => game.status === statusFilter);

  if (loading) {
    return (
      <ImageBackground
        source={BasketballImage}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={item => item.toString()}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListHeaderComponent={
            <View style={styles.filterRow}>
              {STATUS_FILTERS.map(f => (
                <Pressable
                  key={f.value}
                  style={[
                    styles.filterButton,
                    statusFilter === f.value && styles.filterButtonActive,
                  ]}
                  onPress={() => setStatusFilter(f.value)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      statusFilter === f.value && styles.filterButtonTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          }
        />
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={BasketballImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <FlatList
        data={filteredGames}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
          >
            <GameCard game={item} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.filterRow}>
            {STATUS_FILTERS.map(f => (
              <Pressable
                key={f.value}
                style={[
                  styles.filterButton,
                  statusFilter === f.value && styles.filterButtonActive,
                ]}
                onPress={() => setStatusFilter(f.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    statusFilter === f.value && styles.filterButtonTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>
        }
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#1976d2',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default DashboardScreen;
