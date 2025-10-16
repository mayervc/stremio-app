import { useOnboardingStore } from '@/store/onboardingStore'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

export default function SplashScreenComponent() {
  const { hasSeenOnboarding, isCompleted } = useOnboardingStore()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const morphAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleXAnim = useRef(new Animated.Value(0.3)).current
  const scaleYAnim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const prepare = async () => {
      try {
        // Start morphing animation sequence
        Animated.sequence([
          // Stage 1: Fade in and start as small square
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(scaleXAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(scaleYAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          // Stage 2: Morph into circle (by rotating and scaling)
          Animated.parallel([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(morphAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
          // Stage 3: Final transformation
          Animated.parallel([
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.spring(scaleXAnim, {
              toValue: 1.2,
              tension: 30,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(scaleYAnim, {
              toValue: 1.2,
              tension: 30,
              friction: 8,
              useNativeDriver: true,
            }),
          ]),
        ]).start()

        // Wait for the full duration
        await new Promise(resolve => setTimeout(resolve, 4000))

        // Navigate based on onboarding status
        if (hasSeenOnboarding && isCompleted) {
          console.log(
            'Splash screen - Onboarding completed, navigating to signup'
          )
          router.replace('/signup')
        } else {
          console.log('Splash screen - Navigating to onboarding-start')
          router.replace('/onboarding-start')
        }
      } catch (e) {
        console.warn(e)
        // Even if there's an error, navigate based on onboarding status
        if (hasSeenOnboarding && isCompleted) {
          router.replace('/signup')
        } else {
          router.replace('/onboarding-start')
        }
      }
    }

    // Start immediately
    prepare()
  }, [])

  return (
    <View style={styles.container}>
      {/* Central Icon with Animation */}
      <View style={styles.iconContainer}>
        <Animated.View
          style={[
            styles.animatedIcon,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scaleX: scaleXAnim,
                },
                {
                  scaleY: scaleYAnim,
                },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
                {
                  scale: morphAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.8, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.Image
            source={require('@/assets/images/splash-frame-icon.png')}
            style={[
              styles.iconImage,
              {
                borderRadius: morphAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 50], // Morphs from square (0) to circle (50)
                }),
              },
            ]}
            resizeMode='contain'
          />
        </Animated.View>
      </View>

      {/* Version at the bottom */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          Version {Constants.expoConfig?.version || '1.0.1'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF3B30', // Red background
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 100,
    height: 100,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  versionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
})
