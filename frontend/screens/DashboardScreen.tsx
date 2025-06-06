import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getGames } from '../utils/api';
import GameCard from '../components/GameCard';
import SkeletonCard from '../components/SkeletonCard';

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
    // Poll every 10 seconds
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

  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3]}
        keyExtractor={item => item.toString()}
        renderItem={() => <SkeletonCard />}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    );
  }

  if (error) {
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'red' }}>{error}</Text>
    </View>
  }

  return (
    <FlatList
      data={games}
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
    />
  );
};

export default DashboardScreen;
