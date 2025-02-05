import React, {useState} from 'react';
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

const ProfilePage = ({navigation}) => {
  const user = {
    name: 'John Doe',
    age: 30,
    sex: 'Male',
    profilePhoto: 'https://cdn-icons-png.flaticon.com/128/2202/2202112.png',
  };

  const familyMembers = [
    {
      id: '1',
      name: 'Jane Doe',
      age: 28,
      sex: 'Female',
      image: 'https://cdn-icons-png.flaticon.com/256/8326/8326711.png',
    },
    {
      id: '2',
      name: 'Sam Doe',
      age: 5,
      sex: 'Male',
      image: 'https://cdn-icons-png.flaticon.com/256/4825/4825112.png',
    },
  ];

  const [savedPlaces, setSavedPlaces] = useState([
    {
      id: '1',
      name: 'Home',
      address: '123 Main St',
      lat: '40.7128',
      long: '-74.0060',
    },
    {
      id: '2',
      name: 'Work',
      address: '456 Office Rd',
      lat: '40.7306',
      long: '-73.9352',
    },
  ]);

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
            {user.age} | {user.sex}
          </Text>
        </View>
        <Image source={{uri: user.profilePhoto}} style={styles.profilePhoto} />
      </View>

      {/* Family Members Section */}
      <Text style={styles.sectionTitle}>Family Members</Text>
      <FlatList
        data={familyMembers}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.familyMemberContainer}>
            <Image
              source={{
                uri: item.image,
              }}
              style={styles.familyMemberAvatar}
            />
            <View style={styles.familyMemberDetails}>
              <Text style={styles.familyMemberName}>{item.name}</Text>
              <Text style={styles.familyMemberInfo}>
                {item.age} | {item.sex}
              </Text>
            </View>
          </View>
        )}
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
            <Text style={{flex: 1}}>{item.address}</Text>
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
              value={newPlace.name || ''}
              onChangeText={text => setNewPlace({...newPlace, name: text})}
            />
            <TextInput
              style={styles.placeInput}
              placeholder="Enter address"
              placeholderTextColor="#666"
              value={newPlace.address || ''}
              onChangeText={text => setNewPlace({...newPlace, address: text})}
            />
            <TextInput
              style={styles.placeInput}
              placeholder="Enter latitude"
              placeholderTextColor="#666"
              value={newPlace.lat || ''}
              onChangeText={text => setNewPlace({...newPlace, lat: text})}
            />
            <TextInput
              style={styles.placeInput}
              placeholder="Enter longitude"
              placeholderTextColor="#666"
              value={newPlace.long || ''}
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
        <TouchableOpacity onPress={() => console.log('Logging out...')}>
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
  profilePhoto: {width: 80, height: 80, borderRadius: 40},
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
    backgroundColor: '#f9f9f9', // Light background to improve visibility // Explicitly set placeholder color
    placeholderTextColor: '#999',
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
