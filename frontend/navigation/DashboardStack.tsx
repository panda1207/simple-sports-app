import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
import GameDetailScreen from '../screens/GameDetailScreen';

const Stack = createStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator id={'dashboard-stack'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: 'Game Details' }} />
    </Stack.Navigator>
  );
}
