import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const shrinkingStages = ["SafeQuest", "SafQues", "SaQue", "SQu", "SQ"]; // **Hardcoded sequence**

const Intro = ({ onAnimationEnd }) => {
  const fadeWelcome = useRef(new Animated.Value(0)).current;
  const fadeSafeQuest = useRef(new Animated.Value(0)).current;
  const expandGreenCircle = useRef(new Animated.Value(0)).current;
  const expandWhiteCircle = useRef(new Animated.Value(0)).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const [shrinkingText, setShrinkingText] = useState(shrinkingStages[0]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeWelcome, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(fadeWelcome, { toValue: 0, duration: 300, useNativeDriver: true }),

      Animated.timing(fadeSafeQuest, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.delay(200),
    ]).start(() => {
      startHardcodedShrinking(); // 🔥 Use **hardcoded sequence**
    });
  }, []);

  // 🔥 **Hardcoded Shrinking Animation**
  const startHardcodedShrinking = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < shrinkingStages.length) {
        setShrinkingText(shrinkingStages[index]); // Update text stage
        index++;
      } else {
        clearInterval(interval);
        startBubbleAnimation(); // **Circles start after shrinking completes**
      }
    }, 150); // **Speed of text shrinking**
  };

  // **Bubble Expansion**
  const startBubbleAnimation = () => {
    Animated.parallel([
      Animated.timing(expandGreenCircle, {
        toValue: height * 1.5,
        duration: 400, // Faster effect
        useNativeDriver: false,
      }),
      Animated.timing(expandWhiteCircle, {
        toValue: height * 1.5,
        duration: 600,
        delay: 200, // White starts before Green finishes
        useNativeDriver: false,
      }),
      Animated.timing(backgroundColor, {
        toValue: 1,
        duration: 300,
        delay: 300,
        useNativeDriver: false,
      })
    ]).start(() => {
      if (onAnimationEnd) onAnimationEnd();
    });
  };

  const interpolatedBackground = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#001F3F", "#F0F4F8"], // **Blue → White transition**
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedBackground }]}>
      {/* Welcome Text */}
      <Animated.Text style={[styles.welcomeText, { opacity: fadeWelcome }]}>
        Welcome to
      </Animated.Text>

      {/* SafeQuest Shrinking Text */}
      <Animated.Text style={[styles.safeQuestText, { opacity: fadeSafeQuest }]}>
        {shrinkingText}
      </Animated.Text>

      {/* Expanding Circles */}
      <Svg style={styles.circleContainer}>
        <AnimatedCircle cx={width / 2} cy={height / 2} r={expandGreenCircle} fill="#4CAF50" />
        <AnimatedCircle cx={width / 2} cy={height / 2} r={expandWhiteCircle} fill="#F0F4F8" />
      </Svg>
    </Animated.View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#F8F9FA',
    letterSpacing: 2,
    fontFamily: 'DancingScript-Medium',
    position: 'absolute',
    textAlign: 'center',
  },
  safeQuestText: {
    fontSize: 40,
    // fontWeight: 'bold',
    color: '#4CAF50',
    letterSpacing: 3,
    fontFamily: 'DancingScript-Medium',
    position: 'absolute',
    textAlign: 'center',
  },
  circleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
