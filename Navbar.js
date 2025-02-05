import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native';
import Home from './pages/Home';
import Tutorial from './Tutorial';

const Tab = createBottomTabNavigator();

// Dummy Settings Screen
const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen (Coming Soon)</Text>
  </View>
);

// Dummy Profile Screen
const ProfileScreen = ({ route }) => {
  const userName = route?.params?.name || "Your";
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>This is {userName}'s Profile</Text>
    </View>
  );
};

// Function to render tab bar icons from URLs
const getTabIcon = (iconUrl, size) => (
  <Image source={{ uri: iconUrl }} style={{ width: size, height: size }} resizeMode="contain" />
);

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
        tabBarIcon: ({ focused }) => {
          let iconUrl;
          if (route.name === 'Home') iconUrl = 'https://cdn-icons-png.flaticon.com/128/263/263115.png';
          else if (route.name === 'Tutorials') iconUrl = 'https://cdn-icons-png.flaticon.com/128/1258/1258409.png';
          else if (route.name === 'My Profile') iconUrl = 'https://cdn-icons-png.flaticon.com/128/1077/1077063.png';
          else if (route.name === 'Settings') iconUrl = 'https://cdn-icons-png.flaticon.com/128/839/839599.png';

          return getTabIcon(iconUrl, focused ? 28 : 24);
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
