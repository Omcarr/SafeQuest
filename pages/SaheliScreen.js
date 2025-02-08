import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const SaheliScreen = ({ route }) => {
  const navigation = useNavigation();
  const [isMuted, setIsMuted] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    // Auto-answer the call after 5 seconds if not manually answered
    const autoAnswerTimer = setTimeout(() => {
      setIsCallActive(true);
    }, 5000);

    return () => clearTimeout(autoAnswerTimer);
  }, []);

  useEffect(() => {
    let timer;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  // Format Call Time
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      {/* Caller Profile (Moved to Top) */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/727/727393.png",
          }}
          style={styles.callerImage}
        />
        <Text style={styles.callerName}>Saheli</Text>
        <Text style={styles.callStatus}>
          {isCallActive ? formatTime(callTime) : "Ringing..."}
        </Text>
      </View>

      {/* Call Controls (Moved to Bottom) */}
      <View style={styles.callControls}>
        {/* Mute Button with Icon Toggle */}
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.activeControl]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Image
            source={{
              uri: isMuted
                ? "https://cdn-icons-png.flaticon.com/128/665/665909.png"
                : "https://cdn-icons-png.flaticon.com/128/59/59120.png",
            }}
            style={styles.icon}
          />
          <Text style={styles.controlText}>{isMuted ? "Unmute" : "Mute"}</Text>
        </TouchableOpacity>

        {/* Speaker Button (No Toggle State) */}
        <TouchableOpacity style={styles.controlButton}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/59/59284.png",
            }}
            style={styles.icon}
          />
          <Text style={styles.controlText}>Speaker</Text>
        </TouchableOpacity>

        {/* End Call Button */}
        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={() => {
            setIsCallActive(false);
            setCallTime(0);
            navigation.goBack(); // Navigate back to previous screen
          }}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/8300/8300107.png",
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
    backgroundColor: "#000",
    justifyContent: "space-between", // **Distributes Header & Controls Properly**
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 80, // **Creates Space for the Top Profile Section**
  },
  header: {
    alignItems: "center",
  },
  callerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  callerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
  },
  callStatus: {
    fontSize: 18,
    color: "#AAA",
    marginTop: 5,
  },
  callControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  controlButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#333",
    width: 80,
    height: 80,
    justifyContent: "center",
  },
  activeControl: {
    backgroundColor: "#555",
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: "#FFF",
  },
  controlText: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 5,
  },
  endCallButton: {
    backgroundColor: "#D32F2F",
  },
});
