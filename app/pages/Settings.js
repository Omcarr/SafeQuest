import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';


const Settings = ({ navigation }) => {
  // Handle Delete Account Confirmation
  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => console.log("Account Deleted"), style: "destructive" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header Section (Back Button + Title) */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/128/271/271220.png' }} 
            style={styles.backIcon} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Settings Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Account Management */}
        <Text style={styles.sectionTitle}>👤 Account Management</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EditProfile')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1077/1077063.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ManageFamily')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1688/1688116.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Manage Family</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ChangePassword')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/159/159478.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => console.log('Regenerating Family Code...')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/419/419619.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Regenerate Family Code</Text>
        </TouchableOpacity>

        {/* Security & Safety */}
        <Text style={styles.sectionTitle}>🔐 Security & Safety</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EmergencyContacts')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4225/4225060.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Emergency Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('SecuritySettings')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/565/565547.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Security & Privacy</Text>
        </TouchableOpacity>

        {/* Support & Assistance */}
        <Text style={styles.sectionTitle}>📞 Support & Assistance</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('HelpFAQs')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/13567/13567511.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Help & FAQs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ReportIssue')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5058/5058317.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Report an Issue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ContactUs')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/561/561127.png' }} style={styles.icon} />
          <Text style={styles.settingText}>Contact Us</Text>
        </TouchableOpacity>

        {/* Legal & App Info */}
        <Text style={styles.sectionTitle}>📜 Legal & App Information</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('TermsPrivacy')}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/4491/4491560.png' }} style={styles.icon} />
        <Text style={styles.settingText}>Terms & Privacy Policy</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('AboutSafeQuest')}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1946/1946488.png' }} style={styles.icon} />
        <Text style={styles.settingText}>About SafeQuest</Text>
        </TouchableOpacity>


        {/* Danger Zone */}
        <Text style={styles.sectionTitleDanger}>⚠️ Danger Zone</Text>
        <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleDeleteAccount}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/1214/1214428.png' }} style={styles.icon} />
          <Text style={[styles.settingText, styles.dangerText]}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // Reduce horizontal padding
    paddingVertical: 8, // Reduce vertical padding
    backgroundColor: '#FFF',
    elevation: 2, // Keep minimal shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
    color: '#222',
  },
  sectionTitleDanger: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
    color: '#D32F2F',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
    // elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dangerItem: {
    backgroundColor: '#FFEBEE',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  dangerText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
});
