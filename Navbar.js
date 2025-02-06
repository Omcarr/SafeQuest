import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NavigationPage from './pages/NavigationPage';
import FamilyPage from './pages/FamilyPage';
import TripHistory from './pages/TripHistory';
import CommunityPage from './pages/CommunityPage';
import ProfileHead from './pages/ProfileHead'; // Import the profile header

const Tab = createBottomTabNavigator();

// Function to wrap each screen with ProfileHead
const ScreenWrapper = ({children}) => {
  return (
    <View style={{flex: 1}}>
      <ProfileHead /> {/* Adds the "Hello Mihit" and Profile Icon at the top */}
      {children}
    </View>
  );
};

// Function to render tab bar icons from URLs
const getTabIcon = (iconUrl, size, isThicker = false) => (
  <Image
    source={{uri: iconUrl}}
    style={{
      width: isThicker ? size + 4 : size, // Increase size slightly
      height: isThicker ? size + 4 : size,
      resizeMode: 'contain',
    }}
  />
);

const Navbar = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#666',

        tabBarIcon: ({focused}) => {
          let iconUrl;
          let isThicker = false; // Default: No extra thickness

          if (route.name === 'Navigation') {
            iconUrl = 'https://cdn-icons-png.flaticon.com/128/592/592245.png';
          } else if (route.name === 'Family') {
            iconUrl = 'https://cdn-icons-png.flaticon.com/128/1416/1416832.png';
            isThicker = true; // Slightly thicker Family icon
          } else if (route.name === 'History') {
            iconUrl = 'https://cdn-icons-png.flaticon.com/128/3503/3503786.png';
          } else if (route.name === 'Community') {
            iconUrl = 'https://cdn-icons-png.flaticon.com/128/2956/2956777.png';
            isThicker = true; // Slightly thicker Community icon
          } else if (route.name === 'Profile') {
            iconUrl = 'https://cdn-icons-png.flaticon.com/128/1077/1077063.png';
          }

          return getTabIcon(iconUrl, focused ? 28 : 24, isThicker);
        },
      })}>
      <Tab.Screen
        name="Navigation"
        children={() => (
          <ScreenWrapper>
            <NavigationPage />
          </ScreenWrapper>
        )}
      />
      <Tab.Screen
        name="Family"
        children={() => (
          <ScreenWrapper>
            <FamilyPage />
          </ScreenWrapper>
        )}
      />
      <Tab.Screen
        name="History"
        children={() => (
          <ScreenWrapper>
            <TripHistory />
          </ScreenWrapper>
        )}
      />
      <Tab.Screen
        name="Community"
        children={() => (
          <ScreenWrapper>
            <CommunityPage />
          </ScreenWrapper>
        )}
      />
    </Tab.Navigator>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: 60,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 5, // Shadow effect
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
