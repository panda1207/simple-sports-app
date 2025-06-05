import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { getGames } from '../utils/api';
import GameCard from '../components/GameCard';

export default function DashboardScreen({ navigation }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames().then(setGames);
  }, []);

  return (
    <View>
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard game={item} onPress={() => navigation.navigate('GameDetail', { game: item })} />
        )}
      />
    </View>
  );
}