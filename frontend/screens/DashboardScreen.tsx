import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getGames } from '../utils/api';
import GameCard from '../components/GameCard';

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
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadGames();
    // Poll every 10 seconds
    const interval = setInterval(() => {
      loadGames();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadGames();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

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
