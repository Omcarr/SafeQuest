import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const CreateFamily = () => {
  const [familyCode, setFamilyCode] = useState('12345ABC'); // Your family code here
  const [showQRCode, setShowQRCode] = useState(false); // State to toggle QR code visibility

  const handleGenerateQRCode = () => {
    setShowQRCode(true); // Show QR code when button is pressed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.familyCodeText}>Family Code: {familyCode}</Text>

      <Button title="Generate QR Code" onPress={handleGenerateQRCode} />

      {showQRCode && (
        <View style={styles.qrCodeContainer}>
          <QRCode value={familyCode} size={200} />
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
    padding: 20,
  },
  familyCodeText: {
    fontSize: 20,
    marginBottom: 20,
  },
  qrCodeContainer: {
    marginTop: 20,
  },
});

export default CreateFamily;
