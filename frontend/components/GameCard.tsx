import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Game } from '../types/types';

const GameCard = ({ game }: { game: Game }) => {
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
      <View style={styles.row}>
        <View style={styles.teamsContainer}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Image source={{ uri: game.homeTeam.logo }} style={{ width: 40, height: 40 }} />
              <Text style={styles.abbreviation}>{game.homeTeam.abbreviation}</Text>
              <Text style={styles.name}>{game.homeTeam.name}</Text>
            </View>
            <View style={styles.vsContainer}>
              <Text style={styles.vs}>vs</Text>
            </View>
            <View style={styles.column}>
              <Image source={{ uri: game.awayTeam.logo }} style={{ width: 40, height: 40 }} />
              <Text style={styles.abbreviation}>{game.awayTeam.abbreviation}</Text>
              <Text style={styles.name}>{game.awayTeam.name}</Text>
            </View>
          </View>
          {renderStatus()}
          {game.status === 'final' && (
            <Text style={styles.teamInfo}>Winner: {game.winner}</Text>
          )}
          {game.status === 'inProgress' && (
            <Text style={styles.teamInfo}>Score: {game.homeTeam.score} - {game.awayTeam.score} | {game.period} | {game.clock}</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={28} color="#888" style={styles.chevron} />
      </View>
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
    alignItems: 'stretch'
  },
  teams: { 
    fontWeight: 'bold', 
    fontSize: 16,
    textAlign: 'center',
  },
  teamInfo: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamsContainer: {
    flex: 1,
    gap: 8,
  },
  column: {
    flex: 4,
    alignItems: 'center',
    gap: 4,
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
  chevron: {
    marginLeft: 12,
    alignSelf: 'center',
  },
});

export default GameCard;
