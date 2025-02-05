import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Home from './pages/Home';
import Tutorial from './Tutorial';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

// Dummy Settings Screen
const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen (Coming Soon)</Text>
  </View>
);

// Dummy Profile Screen
const ProfileScreen = ({ route }) => {
  const userName = route?.params?.name || "Your"; // Default to "Your" if no name is passed
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>This is {userName}'s Profile</Text>
    </View>
  );
};

const Navbar = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          elevation: 5, // Shadow effect
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#666',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Tutorials') iconName = 'school';
          else if (route.name === 'My Profile') iconName = 'person';
          else if (route.name === 'Settings') iconName = 'settings';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Tutorials" component={Tutorial} />
      <Tab.Screen name="My Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default Navbar;
