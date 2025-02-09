import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../userContext';
import {API_URL} from './constants';

const ProfileHead = () => {
  const navigation = useNavigation();
  const {userData} = useUser();
  const user = userData;

  const sosAlert = () => {
    console.log('aaya');
    const url = `${API_URL}api/sos_alert?user_id=${encodeURIComponent(
      user.user_id,
    )}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      // .then(data => {
      //   if (!Array.isArray(data)) {
      //     throw new Error('Unexpected response format: expected an array');
      //   }

      //   // Update state with the processed family data
      //   setSavedPlaces(data);
      //   console.log(data);
      //   console.log(savedPlaces);

      //   // Redirect to MainApp
      // })
      .catch(error => console.error('Error:', error));
  };

  return (
    // <SafeAreaView style={styles.safeArea}>
    //   <View style={styles.header}>
    //     <Text style={styles.helloText}>Hello {user.name.split(' ')[0]}</Text>
    //     <TouchableOpacity onPress={() => navigation.navigate('My Profile')}>
    //       <Image source={{uri: user.pfp}} style={styles.profileIcon} />
    //     </TouchableOpacity>
    //   </View>
    // </SafeAreaView>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.helloText}>Hello {user.name.split(' ')[0]}</Text>

        <View style={styles.headerRight}>
          {/* SOS Button */}
          <TouchableOpacity onPress={sosAlert}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/7258/7258201.png',
              }}
              style={styles.sosIcon}
            />
          </TouchableOpacity>

          {/* Profile Icon */}
          <TouchableOpacity onPress={() => navigation.navigate('My Profile')}>
            <Image source={{uri: user.pfp}} style={styles.profileIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   safeArea: {
//     backgroundColor: '#FFF',
//   },
//   header: {
//     height: 60,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     backgroundColor: '#FFF',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: {width: 0, height: 2},
//     shadowRadius: 4,
//   },
//   helloText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   profileIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
// });
const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 10,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  helloText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Adds space between SOS button and profile
  },
  sosButton: {
    backgroundColor: '#ff4d4d', // Red for emergency
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Adds shadow
  },
  sosText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd', // Light border
  },
  sosIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd', // Light border
  },
});

export default ProfileHead;
