import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GameCard = ({ game }) => {
  const renderStatus = () => {
    switch (game.status) {
      case 'scheduled':
        return <Text style={styles.teams}>Scheduled</Text>;
      case 'inProgress':
        return <Text style={styles.teams}>In Progress</Text>;
      case 'final':
        return <Text style={styles.teams}>Final</Text>;
      default:
        return <Text style={styles.teams}>Unknown Status</Text>;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.abbreviation}>{game.homeTeam.abbreviation}</Text>
            <Text style={styles.name}>{game.homeTeam.name}</Text>
          </View>
          <View style={styles.vsContainer}>
            <Text style={styles.vs}>vs</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.abbreviation}>{game.awayTeam.abbreviation}</Text>
            <Text style={styles.name}>{game.awayTeam.name}</Text>
          </View>
        </View>
      </View>
      {renderStatus()}
      {game.status === 'final' && (
        <Text>Winner: {game.winner}</Text>
      )}
      {game.status === 'in_progress' && (
        <Text>Score: {game.homeScore} - {game.awayScore} | {game.period} | {game.clock}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    padding: 12, 
    margin: 8, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    elevation: 2, 
    alignItems: 'center'
  },
  teams: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flex: 4,
    alignItems: 'center',
  },
  vsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  abbreviation: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  name: {
    fontSize: 14,
    color: '#555',
  },
  vs: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameCard;
