import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

const AboutSafeQuest = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/271/271220.png' }} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About SafeQuest</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* App Introduction */}
        <Text style={styles.sectionTitle}>🌍 What is SafeQuest?</Text>
        <Text style={styles.text}>
          SafeQuest is a <Text style={styles.boldText}>smart safety and navigation app</Text> that helps users find the <Text style={styles.boldText}>safest</Text> and most <Text style={styles.boldText}>convenient routes</Text>.
          Using <Text style={styles.boldText}>machine learning</Text> and <Text style={styles.boldText}>real-time crime data</Text>, SafeQuest ensures users travel securely.
        </Text>

        {/* Key Features */}
        <Text style={styles.sectionTitle}>🚀 Key Features</Text>
        <Text style={styles.text}>✅ <Text style={styles.boldText}>Smart Route Navigation</Text> - Uses AI & crime data to suggest safe travel paths.</Text>
        <Text style={styles.text}>✅ <Text style={styles.boldText}>Real-time Location Tracking</Text> - Stay connected with family members.</Text>
        <Text style={styles.text}>✅ <Text style={styles.boldText}>Incident Reporting</Text> - Report incidents and receive community alerts.</Text>
        <Text style={styles.text}>✅ <Text style={styles.boldText}>Emergency Contacts</Text> - Quick access to emergency contacts for immediate help.</Text>
        <Text style={styles.text}>✅ <Text style={styles.boldText}>Secure Family Code System</Text> - Manage family groups with a unique code.</Text>
        <Text style={styles.text}>✅ <Text style={styles.boldText}>Privacy & Security</Text> - Your data remains private and encrypted.</Text>

        {/* Technology Stack */}
        <Text style={styles.sectionTitle}>💡 Technologies Used</Text>
        <Text style={styles.text}>🔹 <Text style={styles.boldText}>Machine Learning (ML)</Text> - Predictive crime pattern analysis.</Text>
        <Text style={styles.text}>🔹 <Text style={styles.boldText}>React Native</Text> - Cross-platform mobile development.</Text>
        <Text style={styles.text}>🔹 <Text style={styles.boldText}>Firebase / AWS</Text> - Secure backend & real-time data sync.</Text>
        <Text style={styles.text}>🔹 <Text style={styles.boldText}>Google Maps API</Text> - Location-based services.</Text>
        <Text style={styles.text}>🔹 <Text style={styles.boldText}>Secure Encryption</Text> - Ensuring user privacy and security.</Text>

        {/* Our Mission & Vision */}
        <Text style={styles.sectionTitle}>🎯 Our Mission</Text>
        <Text style={styles.text}>
          Our goal is to <Text style={styles.boldText}>empower people</Text> with cutting-edge <Text style={styles.boldText}>safety solutions</Text>. 
          We believe technology should be a force that ensures people <Text style={styles.boldText}>travel freely and securely</Text> without fear.
        </Text>

        <Text style={styles.sectionTitle}>🌟 Our Vision</Text>
        <Text style={styles.text}>
          SafeQuest aims to be the <Text style={styles.boldText}>global standard</Text> in <Text style={styles.boldText}>safe travel and emergency response technology</Text>—by using <Text style={styles.boldText}>AI-driven navigation</Text> and <Text style={styles.boldText}>real-time alerts</Text>.
        </Text>

        {/* Version & Developer Info */}
        <Text style={styles.sectionTitle}>📌 App Information</Text>
        <Text style={styles.text}>📅 <Text style={styles.boldText}>Version:</Text> 1.0.0</Text>
        <Text style={styles.text}>👨‍💻 <Text style={styles.boldText}>Developed by:</Text> SafeQuest Team</Text>
        <Text style={styles.text}>📧 <Text style={styles.boldText}>Contact:</Text> support@safequest.com</Text>

        <Text style={styles.footerText}>🚀 Thank you for trusting SafeQuest!</Text>
      </ScrollView>
    </View>
  );
};

export default AboutSafeQuest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    elevation: 2, 
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 18, 
    height: 18, 
    tintColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: 20,
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
  boldText: {
    fontWeight: 'bold',
    color: '#222',
  },
  footerText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});
