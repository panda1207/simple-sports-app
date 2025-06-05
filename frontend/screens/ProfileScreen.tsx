import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { UserContext } from '../context/UserContext';

const ProfileScreen = () => {
  const { user } = useContext(UserContext);

  return (
    <View>
      <Text>Username: {user.username}</Text>
      <Text>Balance: ${user.balance}</Text>
      <Text>Wins: {user.stats.wins} | Losses: {user.stats.losses} | Pending: {user.stats.pending}</Text>
      <Text>Predictions:</Text>
      <FlatList
        data={user.predictions}
        keyExtractor={item => item?.gameId}
        renderItem={({ item }) => (
          <View>
            <Text>{item.gameId}: {item.pick} - {item.result} - ${item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ProfileScreen;
