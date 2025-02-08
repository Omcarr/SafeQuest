import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  PanResponder,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const FloatingButton = () => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const tapRef = useRef(null);

  // **Set Default Position (Top Right)**
  const pan = useRef(
    new Animated.ValueXY({
      x: width / 2 - 175,
      y: height / 2 - height + 150,
    }),
  ).current;

  // **Handle Dragging**
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({x: pan.x._value, y: pan.y._value});
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset(); // No automatic repositioning
      },
    }),
  ).current;

  // **Handle Double Tap to Navigate to SaheliScreen**
  const handleDoubleTap = () => {
    const now = Date.now();
    if (tapRef.current && now - tapRef.current < 300) {
      navigation.navigate('SaheliScreen');
    }
    tapRef.current = now;
  };

  // **Toggle Expand/Collapse on Single Tap**
  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  return (
    <Animated.View
      style={[
        styles.floatingContainer,
        {transform: pan.getTranslateTransform()},
      ]}
      {...panResponder.panHandlers}>
      {/* SAHELI Button */}
      <TouchableOpacity
        style={[styles.saheliButton, expanded && styles.saheliButtonExpanded]}
        onPress={toggleExpand}
        onLongPress={handleDoubleTap} // **Double Tap Navigation**
      >
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/128/163/163847.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.text}>SAHELI</Text>
      </TouchableOpacity>

      {/* Expanded Menu (Single Tap to Open) */}
      {expanded && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.callButton}>
            <Image
              source={{
                uri: 'https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/accept-call-icon.png',
              }}
              style={styles.callIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.muteButton}
            onPress={() => navigation.navigate('SaheliScreen')}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/15/15874.png',
              }}
              style={styles.muteIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.endButton}>
            <Image
              source={{
                uri: 'https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/end-call-icon.png',
              }}
              style={styles.callIcon}
            />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 20, // Adjust position
    right: 20,
    zIndex: 9999,
  },
  saheliButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    elevation: 20,
  },
  saheliButtonExpanded: {
    width: 140, // Expand Horizontally when tapped
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    borderRadius: 30,
    marginTop: 6, // Open Below SAHELI Button
    paddingVertical: 6,
    width: 140, // Match Expanded Width
    elevation: 20,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
    marginRight: 8,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  callButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 50,
  },
  muteButton: {
    backgroundColor: '#A9A9A9',
    padding: 8,
    borderRadius: 50,
  },
  endButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 50,
  },
  callIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFF',
  },
  muteIcon: {
    width: 22,
    height: 22,
    tintColor: '#333', // Dark Gray for Mute
  },
});

export default FloatingButton;
