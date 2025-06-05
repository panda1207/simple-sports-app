import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function GameCard({ game, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding: 10, borderBottomWidth: 1 }}>
        <Text>{game.homeTeam.name} vs {game.awayTeam.name}</Text>
        <Text>Status: {game.status}</Text>
        {game.odds && <Text>Favorite: {game.odds.favorite}</Text>}
      </View>
    </TouchableOpacity>
  );
}