import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Game } from '../types/types';

const statusGradients = {
  scheduled: ['#ffe0b2', '#fffde7'],
  inProgress: ['#fffde7', '#ffe082'],
  final: ['#e8f5e9', '#fff'],
  default: ['#f5f5f5', '#fff'],
};


const statusColors = {
  scheduled: '#1976d2',
  inProgress: '#f9a825',
  final: '#2e7d32',
  default: '#888',
};

const GameCard = ({ game }: { game: Game }) => {
  const getStatusColor = () => {
    switch (game.status) {
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

  const getStatusGradient = () => {
    switch (game.status) {
      case 'scheduled':
        return statusGradients.scheduled;
      case 'inProgress':
        return statusGradients.inProgress;
      case 'final':
        return statusGradients.final;
      default:
        return statusGradients.default;
    }
  };

  const renderStatus = () => {
    let text = '';
    switch (game.status) {
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
      <Text style={[styles.teams, { color: getStatusColor() }]}>
        {text}
      </Text>
    );
  };

  return (
    <LinearGradient
      colors={getStatusGradient()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderColor: getStatusColor(), borderWidth: 1 }]}
    >
      <MaterialCommunityIcons
        name="basketball"
        size={90}
        color="rgba(255,152,0,0.08)"
        style={styles.watermark}
      />
      <View style={styles.row}>
        <View style={styles.teamsContainer}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Image source={{ uri: game.homeTeam.logo }} style={styles.logo} />
              <Text style={styles.abbreviation}>{game.homeTeam.abbreviation}</Text>
              <Text style={styles.name}>{game.homeTeam.name}</Text>
            </View>
            <View style={styles.vsContainer}>
              <Text style={styles.vs}>vs</Text>
            </View>
            <View style={styles.column}>
              <Image source={{ uri: game.awayTeam.logo }} style={styles.logo} />
              <Text style={styles.abbreviation}>{game.awayTeam.abbreviation}</Text>
              <Text style={styles.name}>{game.awayTeam.name}</Text>
            </View>
          </View>
          {renderStatus()}
          {game.status === 'final' && (
            <Text style={[styles.teamInfo, { color: statusColors.final }]}>Winner: {game.winner}</Text>
          )}
          {game.status === 'inProgress' && (
            <Text style={[styles.teamInfo, { color: statusColors.inProgress }]}>
              Score: {game.homeTeam.score} - {game.awayTeam.score} | {game.period} | {game.clock}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={28} color="#bbb" style={styles.chevron} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: { 
    padding: 14, 
    marginVertical: 8, 
    marginHorizontal: 12,
    backgroundColor: '#fff', 
    borderRadius: 12, 
    elevation: 2, 
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    top: -20,
    right: -20,
    zIndex: 0,
  },
  teams: { 
    fontWeight: 'bold', 
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  teamInfo: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
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
    justifyContent: 'center',
  },
  abbreviation: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginTop: 2,
  },
  name: {
    fontSize: 14,
    color: '#555',
    marginTop: 1,
  },
  vs: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 2,
    backgroundColor: '#eee',
  },
  chevron: {
    marginLeft: 16,
    alignSelf: 'center',
  },
});

export default GameCard;
