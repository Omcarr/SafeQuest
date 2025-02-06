import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import the QR Code library

const JoinFamily = () => {
  const [familyCode, setFamilyCode] = useState('');
  const [generatedQRCode, setGeneratedQRCode] = useState(null);

  const handleScanQRCode = () => {
    //Scanning logic here
    if (!familyCode) {
      Alert.alert('Error', 'Please enter a Family Code');
      return;
    }

    setGeneratedQRCode(familyCode);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Join Family</Text>
      <Text style={styles.subHeader}>
        Enter the Family Code to join a family
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Family Code"
        value={familyCode}
        onChangeText={setFamilyCode}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleScanQRCode}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>

      {generatedQRCode && (
        <View style={styles.qrCodeContainer}>
          <QRCode value={generatedQRCode} size={200} />
        </View>
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JoinFamily;
