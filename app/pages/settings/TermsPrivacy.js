import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

const TermsPrivacy = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/271/271220.png' }} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy Policy</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.text}>
          Welcome to SafeQuest. Your privacy is important to us. This document outlines our terms and privacy policy regarding the collection, use, and disclosure of personal information.
        </Text>

        <Text style={styles.sectionTitle}>1. Data Collection</Text>
        <Text style={styles.text}>
          We collect minimal data necessary to provide you with a secure and efficient experience. This may include your name, email, emergency contacts, and location (only with your consent).
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
        <Text style={styles.text}>
          - To provide safety-related services.
          - To improve app functionality and user experience.
          - To notify users of important updates.
        </Text>

        <Text style={styles.sectionTitle}>3. Data Security</Text>
        <Text style={styles.text}>
          Your data is securely stored and protected using encryption. We do not share personal information with third parties except when required by law.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to access, modify, or delete your personal data at any time. If you have questions about your data, contact our support team.
        </Text>

        <Text style={styles.sectionTitle}>5. Changes to This Policy</Text>
        <Text style={styles.text}>
          We may update this policy from time to time. Any changes will be communicated through the app.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this policy, please contact us at support@safequest.com.
        </Text>

        <Text style={styles.footerText}>Last Updated: February 2025</Text>
      </ScrollView>
    </View>
  );
};

export default TermsPrivacy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Background color remains
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    elevation: 2, // Minimal shadow for elevation
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    paddingHorizontal: 10, // Reduce horizontal padding
    paddingVertical: 8, // Reduce vertical padding
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 18, // Reduced from 24
    height: 18, // Reduced from 24
    tintColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 4, // Space after back button
  },
  content: {
    paddingHorizontal: 20, // Content now has padding
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#222',
  },
  text: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginTop: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});
