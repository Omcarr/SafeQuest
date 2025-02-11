import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useUser} from '../userContext';
import {API_URL} from './constants';
import {format} from 'date-fns';

// const TripHistory = () => {
//   // Sample trips data
//   const trips = [
//     {
//       id: '1',
//       date: '01-02-2024',
//       time: '10:00 AM',
//       source: 'Mumbai',
//       destination: 'Goa',
//     },
//     {
//       id: '2',
//       date: '05-02-2024',
//       time: '8:30 AM',
//       source: 'Delhi',
//       destination: 'Agra',
//     },
//     {
//       id: '3',
//       date: '15-01-2024',
//       time: '12:00 PM',
//       source: 'Bangalore',
//       destination: 'Mysore',
//     },
//   ];

const TripHistory = () => {
  const [trips, setTrips] = useState([
    {
      trip_id: 4,
      user_id: 5,
      start_location_name: 'Home',
      start_latitude: 41.8781,
      start_longitude: -87.6298,
      destination_name: 'Office',
      destination_latitude: 41.8789,
      destination_longitude: -87.6359,
      trip_date: '2025-02-09',
      trip_time: '2025-02-09T14:30:00',
      feedback: 'The route was smooth and well-marked. No issues.',
    },
    {
      trip_id: 5,
      user_id: 5,
      start_location_name: 'Office',
      start_latitude: 41.8789,
      start_longitude: -87.6359,
      destination_name: 'Shopping',
      destination_latitude: 41.8947,
      destination_longitude: -87.624,
      trip_date: '2025-02-09',
      trip_time: '2025-02-09T14:30:00',
      feedback: null,
    },
  ]);
  const {userData} = useUser();
  const user = userData;

  // States for modal visibility and trip review
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [review, setReview] = useState('');

  const openModal = trip => {
    setSelectedTrip(trip);
    setReview(''); // Clear previous review if any
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTrip(null);
  };

  const saveReview = () => {
    console.log('Review for trip:', selectedTrip.id, review);
    closeModal();
  };

  const fetchHistory = () => {
    console.log('aaya');
    const url = `${API_URL}api/past_trips/${encodeURIComponent(user.user_id)}`;

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
        setTrips(data);
        console.log(data);

        // Redirect to MainApp
      })
      .catch(error => console.error('Error:', error));
  };

  // useEffect(() => {
  //   fetchHistory(); // Call fetchData when the page opens
  // }, []);

  const renderItem = ({item}) => {
    const formattedDate = item.trip_date
      ? format(new Date(item.trip_date), 'dd-MM-yyyy')
      : 'Invalid Date';

    // Convert time if it's stored as "HH:mm:ss"
    const formattedTime = item.trip_time
      ? item.trip_time.substring(11, 16) // Extract HH:mm
      : 'Invalid Time';

    return (
      <View style={styles.tripItem}>
        <Text style={styles.tripRoute}>
          {item.start_location_name} to {item.destination_name}
        </Text>
        <Text style={styles.tripDateTime}>
          {formattedDate} at {formattedTime}
        </Text>
        <TouchableOpacity
          onPress={() => openModal(item)}
          style={styles.tripButton}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trip History</Text>
      <FlatList
        data={trips}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      {/* Modal for Trip Details */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Trip Details */}
            {selectedTrip && (
              <View style={styles.tripDetails}>
                <View style={styles.imageBox}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/1149/1149887.png',
                    }}
                    style={styles.tripImage}
                  />
                </View>
                <View style={styles.tripDetailsText}>
                  <Text style={styles.tripDetailText}>Trip Details</Text>
                  <Text>
                    {selectedTrip.start_location_name} to{' '}
                    {selectedTrip.destination_name}
                  </Text>
                  {/* <Text>
                    {selectedTrip.date} at {selectedTrip.time}
                  </Text> */}
                </View>
              </View>
            )}

            {/* Review Input */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review..."
              placeholderTextColor="#999"
              multiline
              value={review}
              onChangeText={text => setReview(text)}
            />

            {/* Save & Cancel Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.roundedButton, , styles.cancelButton]}
                onPress={closeModal}>
                <Text style={[styles.roundedButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roundedButton, styles.saveButton]}
                onPress={saveReview}>
                <Text style={styles.roundedButtonText}>Save Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles for the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  tripItem: {
    padding: 15,
    backgroundColor: '#f0f0ec',
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tripRoute: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tripDateTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  tripButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  tripImage: {
    width: 50, // Adjust width
    height: 50, // Adjust height
    resizeMode: 'contain', // Ensure it scales properly
  },
  imageBox: {
    marginRight: 10, // Adds spacing between image and text
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  tripDetails: {
    flexDirection: 'row', // Aligns children (image & text) horizontally
    alignItems: 'center', // Aligns items vertically in the center
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  tripDetailsText: {
    flex: 1, // Takes remaining space
  },
  reviewInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top', // Ensures text starts from the top
    color: '#000', // Ensures input text is visible
    placeholderTextColor: '#222', // Makes placeholder visible
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonContainer: {
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
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
});

export default TripHistory;
