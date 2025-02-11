import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {API_URL} from './constants';
import {useUser} from '../userContext';
import FamilyLoc from './FamilyLoc';
// import {FlatList} from 'react-native-gesture-handler';

const FamilyPage = ({navigation}) => {
  console.log(navigation);
  const {userData} = useUser();
  const user = userData;

  const [isFamily, setIsFamily] = useState(0); //condition to check if part of family
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
  ]); ///variable for members data

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
        setIsFamily(1);
        console.log(familyMembers);
        console.log('Success:', updatedFamilyData);
        // Redirect to MainApp
      })
      .catch(error => console.error('Error:', error));
  };

  // useEffect(() => {
  //   fetchFamily(); // Call fetchData when the page opens
  // }, []);

  return (
    <View style={styles.container}>
      {isFamily === 0 ? (
        <View style={styles.container}>
          {/* 🎨 Creative Heading */}
          <View style={styles.pageHeader}>
            <Text style={styles.headerText}> Your Family Awaits You!</Text>
            <Text style={styles.subHeader}>
              Stay connected, share moments, and ensure your loved ones' safety.
            </Text>
          </View>

          {/* 🏡 Create & Join Family Buttons */}
          <View style={styles.centerContainer}>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={() => setIsFamily(1)}>
              {/* onPress={() => navigation.navigate('CreateFamily')}> */}
              <Text style={styles.buttonText}>🏠 Create Family</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.joinButton]}
              // onPress={() => navigation.navigate('JoinFamily')}>
              onPress={() => setIsFamily(1)}>
              <Text style={styles.buttonText}>🔗 Join Family</Text>
            </TouchableOpacity>
          </View>

          {/* 📌 Why Join a Family? */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoHeading}>🔍 Why Join a Family?</Text>
            <Text style={styles.infoText}>
              ✅ Know your family's real-time location.
            </Text>
            <Text style={styles.infoText}>
              ✅ Access emergency contacts instantly.
            </Text>
            <Text style={styles.infoText}>
              ✅ Stay updated with important events.
            </Text>
            <Text style={styles.infoText}>
              ✅ A safe space for sharing & caring.
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View>
            <View style={styles.pageHeader}>
              <Text style={styles.headerText}>Family Members</Text>
            </View>
            <FlatList
              data={familyMembers}
              keyExtractor={item => item.user_id.toString()} // Ensure unique keys
              renderItem={({item, index}) => {
                if (item.user_id === user.user_id) return null;

                return (
                  <View
                    style={[
                      styles.memberItem,
                      index % 2 === 0 ? styles.alignLeft : styles.alignRight,
                      {
                        backgroundColor:
                          index % 2 === 0 ? '#f0f8ff' : '#ffffe0',
                      }, // Alternating colors
                    ]}>
                    {/* Profile Image */}
                    <Image
                      source={{uri: item.pfp}}
                      style={styles.memberImage}
                    />

                    {/* Details Section */}
                    <View style={styles.detailsContainer}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberInfo}>Age: {item.age}</Text>
                      <Text style={styles.memberInfo}>
                        Gender: {item.gender}
                      </Text>
                      {/* <Text style={styles.memberInfo}>
                      📅 Added: {new Date(item.added_at).toDateString()}
                    </Text> */}
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <FamilyLoc />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  /** 📌 Main Container **/
  container: {
    flex: 1,
    backgroundColor: '#f4f7fc', // Soft light background
    paddingVertical: 20,
  },

  /** 🎨 Clean & Minimal Header **/
  pageHeader: {
    width: '100%',
    paddingVertical: 10, // Less padding for compact look
    alignItems: 'center',
    marginBottom: 20,
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Darker text for contrast
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  subHeader: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
    width: '85%',
  },

  /** 🔘 Buttons **/
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 30,
  },

  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25, // More rounded buttons
    alignItems: 'center',
    marginHorizontal: 10,
  },

  createButton: {
    backgroundColor: '#28a745', // Soft green
  },

  joinButton: {
    backgroundColor: '#007bff', // Soft blue
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /** ℹ️ Info Section **/
  infoContainer: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },

  infoHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },

  infoText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 3,
    textAlign: 'center',
  },

  /** 🏡 Family Member Cards **/
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    height: 90,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 12, // More spacing between cards
    borderWidth: 1,
    borderColor: '#ddd',
  },

  alignLeft: {
    flexDirection: 'row',
    backgroundColor: '#e7f1ff', // Light Blue
  },

  alignRight: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff9e6', // Light Yellow
  },

  /** 👤 Profile Image **/
  imageContainer: {
    position: 'relative',
    marginHorizontal: 15,
  },

  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ddd',
  },

  /** 🎖️ Badges **/
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -8,
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  /** ℹ️ Details Section **/
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },

  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  memberInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
});

export default FamilyPage;
