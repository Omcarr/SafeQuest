import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useUser} from '../userContext';
import {API_URL} from './constants';

const ProfilePage = ({navigation}) => {
  // const user = {
  //   name: 'John Doe',
  //   age: 30,
  //   sex: 'Male',
  //   profilePhoto: 'https://cdn-icons-png.flaticon.com/128/2202/2202112.png',
  // };

  const {userData} = useUser();
  const user = userData;
  const [familyMembers, setFamilyMembers] = useState([
    {
      group_id: 7,
      user_id: 6,
      added_at: '2025-02-08T20:27:58.899898',
      gender: 'Female',
      dob: '1992-03-10',
      name: 'Anjali Yeole',
      pfp: 'https://cdn-icons-png.flaticon.com/128/6997/6997662.png',
      location: '(41.8781, -87.6298)',
      age: 32,
    },
    {
      group_id: 7,
      user_id: 5,
      added_at: '2025-02-08T20:29:27.845666',
      gender: 'Female',
      dob: '1990-05-15',
      name: 'Shrutika Yeole',
      pfp: 'https://cdn-icons-png.flaticon.com/128/6997/6997662.png',
      location: '(41.8781, -87.6298)',
      age: 34,
    },
    {
      group_id: 7,
      user_id: 7,
      added_at: '2025-02-09T07:13:06.937584',
      gender: 'Male',
      dob: '1985-11-03',
      name: 'Shrikant Yeole',
      pfp: 'https://cdn-icons-png.flaticon.com/128/2202/2202112.png',
      location: '(41.8781, -87.6298)',
      age: 39,
    },
  ]);

  // useEffect(() => {
  //   fetchFamily();
  //   fetchLocations(); // Call fetchData when the page opens
  // }, []);

  // useEffect(() => {
  //   console.log(savedPlaces);
  // }, [savedPlaces]);

  // const familyMembers = [
  //   {
  //     id: '1',
  //     name: 'Jane Doe',
  //     age: 28,
  //     sex: 'Female',
  //     image: 'https://cdn-icons-png.flaticon.com/256/8326/8326711.png',
  //   },
  //   {
  //     id: '2',
  //     name: 'Sam Doe',
  //     age: 5,
  //     sex: 'Male',
  //     image: 'https://cdn-icons-png.flaticon.com/256/4825/4825112.png',
  //   },
  // ];

  // const [savedPlaces, setSavedPlaces] = useState([
  //   {
  //     id: '1',
  //     name: 'Home',
  //     address: '123 Main St',
  //     lat: '40.7128',
  //     long: '-74.0060',
  //   },
  //   {
  //     id: '2',
  //     name: 'Work',
  //     address: '456 Office Rd',
  //     lat: '40.7306',
  //     long: '-73.9352',
  //   },
  // ]);

  const [savedPlaces, setSavedPlaces] = useState([
    {
      user_id: 5,
      location_name: 'Home',
      latitude: 41.8781,
      longitude: -87.6298,
      location_id: 1,
    },
    {
      user_id: 5,
      location_name: 'Work',
      latitude: 41.8789,
      longitude: -87.6359,
      location_id: 2,
    },
    {
      user_id: 5,
      location_name: 'Shopping',
      latitude: 41.8947,
      longitude: -87.624,
      location_id: 3,
    },
  ]);

  const fetchFamily = () => {
    const url = `${API_URL}api/family-groups/${encodeURIComponent(
      user.group_id,
    )}/members`;

    fetch(url, {
      method: 'GET',
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
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format: expected an array');
        }

        // Function to calculate age from DOB
        const calculateAge = dob => {
          if (!dob) return null;
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          // Adjust age if birthday hasn't occurred yet this year
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          return age;
        };

        // Process each family member
        const updatedFamilyData = data.map(member => {
          const age = calculateAge(member.dob);

          // Set profile picture based on gender
          const defaultPfp =
            member.gender === 'Male'
              ? 'https://cdn-icons-png.flaticon.com/128/2202/2202112.png'
              : 'https://cdn-icons-png.flaticon.com/128/6997/6997662.png';

          return {
            ...member,
            age,
            pfp: member.pfp ? member.pfp : defaultPfp,
          };
        });

        // Update state with the processed family data
        setFamilyMembers(updatedFamilyData);
        console.log(familyMembers);
        console.log('Success:', updatedFamilyData);
        // Redirect to MainApp
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchLocations = () => {
    console.log('aaya');
    const url = `${API_URL}api/locations/${encodeURIComponent(user.user_id)}`;

    fetch(url, {
      method: 'GET',
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
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format: expected an array');
        }

        // Update state with the processed family data
        setSavedPlaces(data);
        console.log(data);
        console.log(savedPlaces);

        // Redirect to MainApp
      })
      .catch(error => console.error('Error:', error));
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [newPlace, setNewPlace] = useState({
    name: '',
    address: '',
    lat: '',
    long: '',
  });

  const openModal = (place = null) => {
    setEditingPlace(place);
    setNewPlace(
      place ? {...place} : {name: '', address: '', lat: '', long: ''},
    );
    setModalVisible(true);
  };

  const savePlace = () => {
    if (newPlace.name.trim() && newPlace.lat.trim() && newPlace.long.trim()) {
      if (editingPlace) {
        setSavedPlaces(
          savedPlaces.map(place =>
            place.id === editingPlace.id
              ? {...newPlace, id: editingPlace.id}
              : place,
          ),
        );
      } else {
        setSavedPlaces([
          ...savedPlaces,
          {id: Date.now().toString(), ...newPlace},
        ]);
      }
      setModalVisible(false);
    }
  };

  const removePlace = id => {
    setSavedPlaces(savedPlaces.filter(place => place.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text>
            {user.age} | {user.gender}
          </Text>
        </View>
        <Image source={{uri: user.pfp}} style={styles.profilePhoto} />
      </View>

      {/* Family Members Section */}
      <Text style={styles.sectionTitle}>Family Members</Text>
      <FlatList
        data={familyMembers}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          if (item.user_id === user.user_id) {
            return null; // Skip rendering if user_id matches
          }

          return (
            <View style={styles.familyMemberContainer}>
              <Image
                source={{uri: item.pfp}}
                style={styles.familyMemberAvatar}
              />
              <View style={styles.familyMemberDetails}>
                <Text style={styles.familyMemberName}>{item.name}</Text>
                <Text style={styles.familyMemberInfo}>
                  {item.age} | {item.gender}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Saved Places Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Saved Places</Text>
        <TouchableOpacity onPress={() => openModal()}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={savedPlaces}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.placeItem}>
            <Text style={{flex: 1}}>{item.location_name}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/10573/10573603.png',
                  }}
                  style={styles.editButton}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removePlace(item.id)}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/128/484/484662.png',
                  }}
                  style={styles.editButton}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add/Edit Place Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.placeInput}
              placeholder="Enter name"
              placeholderTextColor="#666"
              value={newPlace.location_name || ''}
              onChangeText={text => setNewPlace({...newPlace, name: text})}
            />
            {/* <TextInput
              style={styles.placeInput}
              placeholder="Enter address"
              placeholderTextColor="#666"
              value={newPlace.address || ''}
              onChangeText={text => setNewPlace({...newPlace, address: text})}
            /> */}
            <TextInput
              style={styles.placeInput}
              placeholder="Enter latitude"
              placeholderTextColor="#666"
              vkeyboardType="numeric"
              value={newPlace.latitude ? String(newPlace.latitude) : ''}
              onChangeText={text => setNewPlace({...newPlace, lat: text})}
            />
            <TextInput
              style={styles.placeInput}
              placeholder="Enter longitude"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={newPlace.longitude ? String(newPlace.longitude) : ''}
              onChangeText={text => setNewPlace({...newPlace, long: text})}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.roundedButton, , styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={[styles.roundedButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roundedButton, styles.saveButton]}
                onPress={savePlace}>
                <Text style={styles.roundedButtonText}>
                  {editingPlace ? 'Save' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginSignup')}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/660/660350.png',
            }}
            style={styles.logoutButton}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/9333/9333993.png',
            }}
            style={styles.settingsButton}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {flexDirection: 'column'},
  userName: {fontSize: 20, fontWeight: 'bold'},
  profilePhoto: {width: 70, height: 70, borderRadius: 40},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'blue',
    paddingRight: 10,
  },
  familyMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
  },
  familyMemberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  familyMemberDetails: {
    flexDirection: 'column',
  },
  familyMemberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  familyMemberInfo: {
    fontSize: 14,
    color: '#666',
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  iconContainer: {flexDirection: 'row', alignItems: 'center', gap: 15},
  editButton: {color: 'blue'},
  deleteButton: {color: 'red'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonContainer: {
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  placeInput: {
    padding: 12,
    paddingHorizontal: 15, // Add horizontal padding
    borderWidth: 1, // Change from borderBottomWidth to full border
    borderColor: '#ccc',
    borderRadius: 8, // Add rounded corners
    marginBottom: 10,
    width: '100%',
    color: '#333',
    fontSize: 16,
    backgroundColor: '#f0f0ec', // Light background to improve visibility // Explicitly set placeholder color
    placeholderTextColor: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 6,
    marginBottom: 5,
  },
  editButton: {
    width: 20,
    height: 20,
    // Add any additional styling as needed
  },
  roundedButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff', // Blue color for save/add
  },
  cancelButton: {
    backgroundColor: '#cc0000', // Blue color for save/add
  },
  roundedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 30,
    height: 30,
  },
  logoutButton: {
    width: 30,
    height: 30,
  },
});

export default ProfilePage;
