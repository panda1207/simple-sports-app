import React, { useState, useContext } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { submitPrediction } from '../utils/api';
import { UserContext } from '../context/UserContext';
import { Game } from '../types/types';

type GameDetailScreenRouteParams = {
  GameDetail: {
    game: Game;
  };
};

const GameDetailScreen = () => {
  const route = useRoute<RouteProp<GameDetailScreenRouteParams, 'GameDetail'>>();
  const { game } = route.params;
  const [pick, setPick] = useState('');
  const [amount, setAmount] = useState('');
  const { user } = useContext(UserContext);

  const handleSubmit = () => {
    Alert.alert(
      'Confirm Prediction',
      `Pick: ${pick}\nAmount: $${amount}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => {
          try {
            const res = await submitPrediction(user.id, game.id, pick, Number(amount));
            if (res.success) {
              Alert.alert('Success', res.message);
            } else {
              Alert.alert(res.error);
            }
          } catch (e) {
            Alert.alert('Error', 'Failed to submit prediction');
          }
        }}
      ]
    );
  };

  return (
    <View>
      <Text>
        {game.homeTeam.name} ({game.homeTeam.abbreviation}) vs {game.awayTeam.name} ({game.awayTeam.abbreviation})
      </Text>
      <Text>Status: {game.status}</Text>
      <Text>Odds: </Text>
      <Text>Spread: {game.odds.spread}</Text>
      <Text>Favorite: {game.odds.favorite}</Text>
      <TextInput placeholder="Pick (home/away)" value={pick} onChangeText={setPick} />
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
      <Button
        title="Submit Prediction"
        onPress={handleSubmit}
        disabled={game.status !== 'scheduled'}
      />
      {game.status !== 'scheduled' && <Text>Predictions closed for this game.</Text>}
    </View>
  );
};

export default GameDetailScreen;
