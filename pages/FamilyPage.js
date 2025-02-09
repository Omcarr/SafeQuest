import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {API_URL} from './constants';
import {useUser} from '../userContext';

const FamilyPage = ({navigation}) => {
  console.log(navigation);
  const {userData} = useUser();
  const user = userData;
  const [isFamily, setIsFamily] = useState(0); //condition to check if part of family
  const [familyMembers, setFamilyMembers] = useState(null); ///variable for members data

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

  useEffect(() => {
    fetchFamily(); // Call fetchData when the page opens
  }, []);

  return (
    <View style={styles.container}>
      {isFamily === 0 ? (
        <View style={styles.centerContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CreateFamily')}>
            <Text style={styles.buttonText}>Create Family</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('JoinFamily')}>
            <Text style={styles.buttonText}>Join Family</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={familyMembers}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.memberItem}>
              <Image source={{uri: item.image}} style={styles.memberImage} />
              <View>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text>Age: {item.age}</Text>
                <Text>Sex: {item.sex}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FamilyPage;
