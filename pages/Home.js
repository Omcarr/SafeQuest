import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.helloText}>Hello Mihit</Text>
        <TouchableOpacity onPress={() => navigation.navigate('My Profile')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2202/2202112.png' }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.heading}>Safe Routes App</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('My Profile')}
          >
            <Text style={styles.buttonText}>Go to My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tutorialButton]}
            onPress={() => navigation.navigate('Tutorials')}
          >
            <Text style={styles.buttonText}>Go to Tutorials</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subText}>Explore routes and safety features to navigate efficiently!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  helloText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    marginTop: 80,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
  },
  tutorialButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default Home;
