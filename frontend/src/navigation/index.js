import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

import OwnerDashboardScreen from '../screens/owner/OwnerDashboardScreen';
import DogListScreen from '../screens/owner/DogListScreen';
import AddDogScreen from '../screens/owner/AddDogScreen';
import BookWalkScreen from '../screens/owner/BookWalkScreen';
import WalkHistoryScreen from '../screens/owner/WalkHistoryScreen';
import LiveTrackingScreen from '../screens/owner/LiveTrackingScreen';

import WalkerDashboardScreen from '../screens/walker/WalkerDashboardScreen';
import WalkerRequestsScreen from '../screens/walker/WalkerRequestsScreen';
import WalkerOngoingScreen from '../screens/walker/WalkerOngoingScreen';

import ProfileScreen from '../screens/shared/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const OwnerTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={OwnerDashboardScreen} />
    <Tab.Screen name="Dogs" component={DogListScreen} />
    <Tab.Screen name="Walks" component={WalkHistoryScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const WalkerTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={WalkerDashboardScreen} />
    <Tab.Screen name="Requests" component={WalkerRequestsScreen} />
    <Tab.Screen name="Ongoing" component={WalkerOngoingScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          {user.role === 'owner' ? (
            <Stack.Screen
              name="OwnerTabs"
              component={OwnerTabs}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="WalkerTabs"
              component={WalkerTabs}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen name="AddDog" component={AddDogScreen} />
          <Stack.Screen name="BookWalk" component={BookWalkScreen} />
          <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

