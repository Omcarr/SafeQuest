import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const SaheliScreen = ({route}) => {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    const autoAnswerTimer = setTimeout(() => {
      setIsCallActive(true);
    }, 5000);

    return () => clearTimeout(autoAnswerTimer);
  }, []);

  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('Permissions denied');
        return;
      }

      setIsRecording(true);

      const path =
        Platform.OS === 'android'
          ? `${RNFS.ExternalStorageDirectoryPath}/call_recording.mp3`
          : `${RNFS.DocumentDirectoryPath}/call_recording.mp3`;

      console.log('Starting recording at:', path);
      const uri = await audioRecorderPlayer.startRecorder(path);
      setRecordedFile(uri);

      setTimeout(async () => {
        await stopRecording();
      }, 5000);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      console.log('Recording stopped:', recordedFile);
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const formatTime = seconds => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/727/727393.png',
          }}
          style={styles.callerImage}
        />
        <Text style={styles.callerName}>Saheli</Text>
        <Text style={styles.callStatus}>
          {isCallActive ? formatTime(callTime) : 'Ringing...'}
        </Text>
      </View>

      <View style={styles.callControls}>
        <TouchableOpacity
          style={[styles.controlButton, isRecording && styles.activeControl]}
          onPress={startRecording}>
          <Image
            source={{
              uri: isRecording
                ? 'https://cdn-icons-png.flaticon.com/128/61/61112.png'
                : 'https://cdn-icons-png.flaticon.com/128/61/61111.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.controlText}>
            {isRecording ? 'Recording' : 'Record'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/59/59284.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.controlText}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={() => {
            setIsCallActive(false);
            setCallTime(0);
            navigation.goBack();
          }}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/8300/8300107.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.controlText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SaheliScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between', // **Distributes Header & Controls Properly**
    alignItems: 'center',
    paddingBottom: 50,
    paddingTop: 80, // **Creates Space for the Top Profile Section**
  },
  header: {
    alignItems: 'center',
  },
  callerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  callStatus: {
    fontSize: 18,
    color: '#AAA',
    marginTop: 5,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 50,
    backgroundColor: '#333',
    width: 80,
    height: 80,
    justifyContent: 'center',
  },
  activeControl: {
    backgroundColor: '#555',
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#FFF',
  },
  controlText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
  },
  endCallButton: {
    backgroundColor: '#D32F2F',
  },
});
