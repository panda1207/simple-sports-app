import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.balance}>Balance: <Text style={styles.balanceAmount}>${user.balance}</Text></Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Wins: <Text style={styles.statValue}>{user.stats.wins}</Text></Text>
          <Text style={styles.stat}>Losses: <Text style={styles.statValue}>{user.stats.losses}</Text></Text>
          <Text style={styles.stat}>Pending: <Text style={styles.statValue}>{user.stats.pending}</Text></Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Predictions</Text>
      <FlatList
        data={user.predictions}
        keyExtractor={item => item.gameId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.predictionCard}
            onPress={() =>
              navigation.navigate('Dashboard', {
                screen: 'GameDetail',
                params: { gameId: item.gameId },
              })
            }
          >
            <View style={styles.predictionRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.predictionGame}>{item.gameId}</Text>
                <Text style={styles.predictionDetail}>
                  Pick: <Text style={styles.pick}>{item.pick}</Text> | 
                  Result: <Text style={item.result === 'win' ? styles.win : item.result === 'loss' ? styles.loss : styles.pending}>{item.result}</Text> | 
                  Amount: <Text style={styles.amount}>${item.amount}</Text>
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#888" style={styles.chevron} />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No predictions yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: 16,
  },
  profileBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  balance: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  balanceAmount: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  stat: {
    fontSize: 15,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  predictionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  predictionGame: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#444',
  },
  predictionDetail: {
    fontSize: 14,
    color: '#555',
  },
  pick: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  win: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  loss: {
    color: '#c62828',
    fontWeight: 'bold',
  },
  pending: {
    color: '#f9a825',
    fontWeight: 'bold',
  },
  amount: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
    fontSize: 16,
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 8,
    alignSelf: 'center',
  },
});

export default ProfileScreen;
