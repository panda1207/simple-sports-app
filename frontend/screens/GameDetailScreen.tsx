import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getGame, submitPrediction } from '../utils/api';
import { UserContext } from '../context/UserContext';
import { Game } from '../types/types';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonCard from '../components/SkeletonCard';
import { FlatList } from 'react-native-gesture-handler';

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
  const { user, setUser } = useContext(UserContext);

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
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    fetchGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Only poll every 10 seconds if the game status is not final
    if (game && game.status !== 'final') {
      interval = setInterval(async () => {
        try {
          const updated = await getGame(gameId);
          setGame(updated);
        } catch (e) {
          console.error('Failed to refresh game data:', e);
        }
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameId, game?.status]);

  useEffect(() => {
    if (game && game.homeTeam && game.awayTeam && game.odds?.spread) {
      const favorite = game.odds.favorite;
      const spread = game.odds.spread;
      const homeIsFavorite = game.homeTeam.abbreviation === favorite;
      const homeSpread = homeIsFavorite ? spread : getOppositeSpread(String(spread));
      const awaySpread = homeIsFavorite ? getOppositeSpread(String(spread)) : spread;

      const newItems = [
        { label: 'Select your pick...', value: '' },
        { label: `${game.homeTeam.name} (Winner)`, value: game.homeTeam.abbreviation },
        { label: `${game.awayTeam.name} (Winner)`, value: game.awayTeam.abbreviation },
        { label: `${game.homeTeam.name} (${homeSpread} Spread)`, value: `${game.homeTeam.abbreviation}_spread` },
        { label: `${game.awayTeam.name} (${awaySpread} Spread)`, value: `${game.awayTeam.abbreviation}_spread` },
      ];
      setItems(newItems);
    } else if (game && game.homeTeam && game.awayTeam) {
      const newItems = [
        { label: 'Select your pick...', value: '' },
        { label: `${game.homeTeam.name} (Winner)`, value: game.homeTeam.abbreviation },
        { label: `${game.awayTeam.name} (Winner)`, value: game.awayTeam.abbreviation },
      ];
      setItems(newItems);
    }
  }, [game]);

  const getOppositeSpread = (spread: string) => {
    if (!spread) return '';
    if (spread.startsWith('+')) return '-' + spread.slice(1);
    if (spread.startsWith('-')) return '+' + spread.slice(1);
    return spread;
  }

  const renderStatus = () => {
    let text = '';
    switch (game.status) {
      case 'scheduled':
        text = 'Upcoming';
        break;
      case 'inProgress':
        text = 'Live';
        break;
      case 'final':
        text = 'Completed';
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
    const pickLabel = items.find(item => item.value === pick)?.label || pick;
    Alert.alert(
      'Confirm Prediction',
      `Pick: ${pickLabel}\nAmount: $${amount}`,
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
              };
              setSubmittedPrediction(prediction);
              setIsSubmitted(true);
              setUser(res.user);
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

  if (loading) {
    return (
      <FlatList
        data={[1, 2]}
        keyExtractor={item => item.toString()}
        renderItem={() => <SkeletonCard />}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    );
  }

  
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
              Pick: <Text style={styles.pick}>{items.find(item => item.value === submittedPrediction.pick)?.label || submittedPrediction.pick}</Text>
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
