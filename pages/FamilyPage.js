import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const FamilyPage = ({navigation}) => {
  console.log(navigation);
  const [isFamily, setIsFamily] = useState(0);

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
