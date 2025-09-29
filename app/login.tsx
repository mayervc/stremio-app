import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { z } from 'zod'

// Schema de validación
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar fuentes Poppins
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  if (!fontsLoaded) {
    return null // O un componente de carga
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      // Aquí iría la lógica de autenticación
      console.log('Login data:', data)
      Alert.alert('Success', 'Login successful!')
      // router.replace('/(tabs)')
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'facebook' | 'google' | 'apple') => {
    Alert.alert('Social Login', `${provider} login would be implemented here`)
  }

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality would be implemented here'
    )
  }

  const handleSignUp = () => {
    Alert.alert('Sign Up', 'Sign up screen would be implemented here')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign In</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.formContent}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder='E-mail'
                  placeholderTextColor='#8E8E93'
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <Controller
                control={control}
                name='password'
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor='#8E8E93'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoCapitalize='none'
                    autoCorrect={false}
                  />
                )}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color='#8E8E93'
                />
              </Pressable>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          {/* Forgot Password */}
          <Pressable
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </Pressable>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.signInButton,
              isLoading && styles.signInButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          {/* Or Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('facebook')}
            >
              <Ionicons name='logo-facebook' size={20} color='white' />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Ionicons name='logo-google' size={20} color='white' />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Ionicons name='logo-apple' size={20} color='white' />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't you have an account? </Text>
          <Pressable onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121011',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleContainer: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    marginBottom: 8,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formContent: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#121011',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#8E8E93',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  signInButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  signInButtonDisabled: {
    backgroundColor: '#FF3B30',
    opacity: 0.6,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3A3A3C',
  },
  dividerText: {
    color: '#8E8E93',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    width: 105,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#8E8E93',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  signUpLink: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
})
