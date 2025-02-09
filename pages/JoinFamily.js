import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "react-native-image-picker"; // Used for picking images

const JoinFamily = () => {
  const [familyCode, setFamilyCode] = useState("");
  const [qrImage, setQrImage] = useState(null);
  const [scanning, setScanning] = useState(false);

  const correctCode = "123abc"; // 🔴 Replace with backend API validation

  // ✅ Function to manually check family code
  const handleSubmit = () => {
    if (familyCode.trim().toLowerCase() === correctCode) {
      Alert.alert("Success", "You have joined the family successfully! 🎉");
    } else {
      Alert.alert("Error", "Invalid Family Code. Please try again.");
    }
  };

  // ✅ Function to pick an image from gallery
  const handlePickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setQrImage(imageUri); // Display selected image
        extractQRCode(imageUri); // Send to backend for QR processing
      }
    });
  };

  // ✅ Function to send image to backend for QR extraction
  const extractQRCode = async (imageUri) => {
    try {
      let formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "qr_code.jpg",
        type: "image/jpg",
      });

      const response = await fetch("http://your-backend-url.com/api/scan-qr", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (data.qr_code) {
        console.log("Extracted QR Code:", data.qr_code);
        if (data.qr_code.trim().toLowerCase() === correctCode) {
          Alert.alert("Success", "You have joined the family successfully! 🎉");
        } else {
          Alert.alert("Error", "Invalid QR Code. Please try again.");
        }
      } else {
        Alert.alert("Error", "No QR code detected in the image.");
      }
    } catch (error) {
      console.error("Error extracting QR Code:", error);
      Alert.alert("Error", "Failed to process QR code. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Heading & Subheading */}
      <Text style={styles.header}>Join Family</Text>
      <Text style={styles.subHeader}>Enter the Family Code to join a family</Text>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter Family Code"
        value={familyCode}
        onChangeText={setFamilyCode}
        autoCapitalize="none"
        keyboardType="default" // Allows alphanumeric input
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* OR Section */}
      <Text style={styles.orText}>— OR —</Text>

      {/* Pick QR Code Image Button */}
      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>Upload QR Code Image</Text>
      </TouchableOpacity>

      {/* Display Selected Image */}
      {qrImage && (
        <Image source={{ uri: qrImage }} style={styles.qrImage} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
    textAlign: "center",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 16,
    color: "#777",
    marginVertical: 15,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
});

export default JoinFamily;
