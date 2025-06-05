import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getGame, submitPrediction } from '../utils/api';
import { UserContext } from '../context/UserContext';
import { Game } from '../types/types';

type GameDetailScreenRouteParams = {
  GameDetail: {
    gameId: string;
  };
};

const GameDetailScreen = () => {
  const route = useRoute<RouteProp<GameDetailScreenRouteParams, 'GameDetail'>>();
  const { gameId } = route.params;
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pick, setPick] = useState('');
  const [amount, setAmount] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getGame(gameId);
        setGame(data);
      } catch {
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, []);

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

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <View>
      <Text>
        {game.homeTeam.name} ({game.homeTeam.abbreviation}) vs {game.awayTeam.name} ({game.awayTeam.abbreviation})
      </Text>
      <Text>Status: {game.status}</Text>
      <Text>Odds: </Text>
      <Text>Spread: {game.odds?.spread}</Text>
      <Text>Favorite: {game.odds?.favorite}</Text>
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
