import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Male',
    profilePic: 'https://cdn-icons-png.flaticon.com/128/15315/15315520.png', // Default Profile Picture
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState('Male');
  const [items, setItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ]);

  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Request Permission for Android Media Picker
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Handle Profile Picture Upload
  const handleImageUpload = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      alert('Permission Denied: Cannot Access Media');
      return;
    }

    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        setFormData({ ...formData, profilePic: response.assets[0].uri });
      }
    });
  };

  // Basic Validation
  const validateInputs = () => {
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      alert('Please enter a valid email.');
      return false;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return false;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      navigation.replace('MainApp'); // Redirect to the main app (Navbar.js)
    }
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: formData.profilePic }} style={styles.profileImage} />
          {!isLogin && (
            <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
              <Text style={styles.uploadText}>Upload Profile Picture</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setIsLogin(true)} style={[styles.tab, isLogin && styles.activeTab]}>
            <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(false)} style={[styles.tab, !isLogin && styles.activeTab]}>
            <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        {isLogin ? (
          <>
            <TextInput label="Enter your email" mode="outlined" style={styles.input} keyboardType="email-address" value={formData.email} onChangeText={(text) => handleInputChange('email', text)} />
            <TextInput label="Enter your password" mode="outlined" style={styles.input} secureTextEntry={!showPassword} right={<TextInput.Icon icon={() => <Image source={{ uri: showPassword ? 'https://cdn-icons-png.flaticon.com/128/9726/9726597.png' : 'https://cdn-icons-png.flaticon.com/128/11502/11502541.png' }} style={styles.eyeIcon} />} onPress={() => setShowPassword(!showPassword)} forceTextInputFocus={false} />} value={formData.password} onChangeText={(text) => handleInputChange('password', text)} />
          </>
        ) : (
          <>
            <TextInput label="Full Name" mode="outlined" style={styles.input} value={formData.name} onChangeText={(text) => handleInputChange('name', text)} />
            <TextInput label="Age" mode="outlined" style={styles.input} keyboardType="numeric" value={formData.age} onChangeText={(text) => handleInputChange('age', text)} />

            {/* Gender Dropdown */}
            <View style={styles.genderContainer}>
              <Text style={styles.label}>Select Gender</Text>
              <DropDownPicker open={open} value={gender} items={items} setOpen={setOpen} setValue={setGender} setItems={setItems} containerStyle={styles.pickerContainer} style={styles.picker} dropDownContainerStyle={styles.pickerDropdown} onChangeValue={(value) => handleInputChange('sex', value)} />
            </View>

            <TextInput label="Email Address" mode="outlined" style={styles.input} keyboardType="email-address" value={formData.email} onChangeText={(text) => handleInputChange('email', text)} />
            <TextInput label="Enter your address" mode="outlined" style={styles.input} value={formData.address} onChangeText={(text) => handleInputChange('address', text)} />
            <TextInput label="Create Password" mode="outlined" style={styles.input} secureTextEntry={!showPassword} right={<TextInput.Icon icon={() => <Image source={{ uri: showPassword ? 'https://cdn-icons-png.flaticon.com/128/9726/9726597.png' : 'https://cdn-icons-png.flaticon.com/128/11502/11502541.png' }} style={styles.eyeIcon} />} onPress={() => setShowPassword(!showPassword)} forceTextInputFocus={false} />} value={formData.password} onChangeText={(text) => handleInputChange('password', text)} />
            <TextInput label="Confirm Password" mode="outlined" style={styles.input} secureTextEntry={!showConfirmPassword} right={<TextInput.Icon icon={() => <Image source={{ uri: showConfirmPassword ? 'https://cdn-icons-png.flaticon.com/128/9726/9726597.png' : 'https://cdn-icons-png.flaticon.com/128/11502/11502541.png' }} style={styles.eyeIcon} />} onPress={() => setShowConfirmPassword(!showConfirmPassword)} forceTextInputFocus={false} />} value={formData.confirmPassword} onChangeText={(text) => handleInputChange('confirmPassword', text)} />
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginSignup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0056b3',
  },
  uploadButton: {
    marginTop: 8,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  uploadText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#0056b3',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  activeTabText: {
    color: '#FFF',
  },
  input: {
    width: '100%',
    marginBottom: 12,
  },
  button: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#0056b3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  genderContainer: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD', // Matches other input borders
  },
  pickerDropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: '#555',
  },
});
