import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getGame, submitPrediction } from '../utils/api';
import { UserContext } from '../context/UserContext';
import { Game } from '../types/types';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GameDetailScreenRouteParams = {
  GameDetail: {
    gameId: string;
  };
};

const statusColors = {
  scheduled: '#1976d2',
  inProgress: '#f9a825',
  final: '#2e7d32',
  default: '#888',
};

const GameDetailScreen = () => {
  const route = useRoute<RouteProp<GameDetailScreenRouteParams, 'GameDetail'>>();
  const { gameId } = route.params;
  const { user } = useContext(UserContext);

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pick, setPick] = useState('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedPrediction, setSubmittedPrediction] = useState<any>(null);

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

    useEffect(() => {
    if (game && game.homeTeam && game.awayTeam) {
      const newItems = [
        { label: 'Select your pick...', value: '' },
        { label: game.homeTeam.name, value: game.homeTeam.abbreviation },
        { label: game.awayTeam.name, value: game.awayTeam.abbreviation },
      ];
      if (game.odds?.spread) {
        newItems.push({ label: `Spread (${game.odds.spread})`, value: 'spread' });
      }
      setItems(newItems);
    }
  }, [game]);

  const renderStatus = () => {
    let text = '';
    switch (game?.status) {
      case 'scheduled':
        text = 'Scheduled';
        break;
      case 'inProgress':
        text = 'In Progress';
        break;
      case 'final':
        text = 'Final';
        break;
      default:
        text = 'Unknown Status';
    }
    return (
      <Text style={[styles.status, { color: getStatusColor() }]}>
        {text}
      </Text>
    );
  };

  const getStatusColor = () => {
    switch (game?.status) {
      case 'scheduled':
        return statusColors.scheduled;
      case 'inProgress':
        return statusColors.inProgress;
      case 'final':
        return statusColors.final;
      default:
        return statusColors.default;
    }
  };

  useEffect(() => {
    const loadPrediction = async () => {
      if (!gameId) return;
      const key = `prediction_${gameId}`;
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        setSubmittedPrediction(JSON.parse(saved));
        setIsSubmitted(true);
      }
    };
    loadPrediction();
  }, [gameId]);

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
              const prediction = {
                pick,
                amount,
                result: 'pending',
                gameId: game.id,
                time: Date.now(),
              };
              setSubmittedPrediction(prediction);
              setIsSubmitted(true);
              await AsyncStorage.setItem(`prediction_${game.id}`, JSON.stringify(prediction));
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

  if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!game) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <View style={styles.teamsRow}>
          <View style={styles.teamCol}>
            <Image source={{ uri: game.homeTeam.logo }} style={styles.logo} />
            <Text style={styles.abbreviation}>{game.homeTeam.abbreviation}</Text>
            <Text style={styles.teamName}>{game.homeTeam.name}</Text>
          </View>
          <Text style={styles.vs}>vs</Text>
          <View style={styles.teamCol}>
            <Image source={{ uri: game.awayTeam.logo }} style={styles.logo} />
            <Text style={styles.abbreviation}>{game.awayTeam.abbreviation}</Text>
            <Text style={styles.teamName}>{game.awayTeam.name}</Text>
          </View>
        </View>
        {renderStatus()}
        {game.odds && (
          <View style={styles.oddsBox}>
            <Text style={styles.oddsTitle}>Odds</Text>
            <Text style={styles.oddsDetail}>Spread: <Text style={styles.oddsValue}>{game.odds?.spread}</Text></Text>
            <Text style={styles.oddsDetail}>Favorite: <Text style={styles.oddsValue}>{game.odds?.favorite}</Text></Text>
          </View>
        )}
      </View>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Your Prediction</Text>
        {isSubmitted && submittedPrediction ? (
          <View style={styles.predictionDetailBox}>
            <Text style={styles.predictionDetailText}>
              Pick: <Text style={styles.pick}>{submittedPrediction.pick}</Text>
            </Text>
            <Text style={styles.predictionDetailText}>
              Amount: <Text style={styles.amount}>${submittedPrediction.amount}</Text>
            </Text>
            <Text style={styles.predictionDetailText}>
              Status: <Text style={styles.pending}>Pending</Text>
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.pickerWrapper}>
              <DropDownPicker
                open={open}
                value={pick}
                items={items}
                setOpen={setOpen}
                setValue={setPick}
                setItems={setItems}
                disabled={game.status !== 'scheduled'}
                placeholder="Select your pick..."
                style={[
                  styles.picker,
                  game.status !== 'scheduled' && styles.pickerDisabled
                ]}
                dropDownContainerStyle={styles.dropDownContainer}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[
                styles.button,
                (game.status !== 'scheduled' || !pick || parseFloat(amount) <= 0) && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={game.status !== 'scheduled' || !pick || parseFloat(amount) <= 0}
            >
              <Text style={styles.buttonText}>Submit Prediction</Text>
            </TouchableOpacity>
            {game.status !== 'scheduled' && (
              <Text style={styles.closedText}>Predictions closed for this game.</Text>
            )}
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 22,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamCol: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 4,
    backgroundColor: '#eee',
  },
  abbreviation: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#1976d2',
  },
  teamName: {
    fontSize: 15,
    color: '#444',
    marginTop: 2,
  },
  vs: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    marginHorizontal: 12,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  oddsBox: {
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    alignItems: 'center', // center the odds content
  },
  oddsTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#2e7d32',
    textAlign: 'center',
  },
  oddsDetail: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  oddsValue: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1976d2',
  },
  input: {
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: '#b0bec5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closedText: {
    color: '#c62828',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    justifyContent: 'center',
    zIndex: 1000,
  },
  picker: {
    borderColor: '#ccc',
    borderWidth: 1,
  },
  pickerDisabled: {
    backgroundColor: '#f6f8fa',
    borderColor: '#ccc',
    color: '#aaa',
    borderWidth: 0,
  },
  dropDownContainer: {
    borderColor: '#ccc',
  },
  predictionDetailBox: {
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionDetailText: {
    fontSize: 16,
    marginVertical: 2,
    color: '#333',
  },
  pick: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  amount: {
    color: '#388e3c',
    fontWeight: 'bold',
  },
  pending: {
    color: '#f9a825',
    fontWeight: 'bold',
  },
});

export default GameDetailScreen;
