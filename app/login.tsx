import { SocialButton } from '@/components/social-button'
import { Colors } from '@/constants/colors'
import { useLogin } from '@/hooks/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
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
  const loginMutation = useLogin()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  // Watch form values to determine if login button should be enabled
  const watchedValues = watch()
  const isFormValid = isValid && watchedValues.email && watchedValues.password

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    })
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
                  placeholderTextColor={Colors.placeholder}
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
                    placeholderTextColor={Colors.placeholder}
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
                  color={Colors.icon.primary}
                />
              </Pressable>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          {/* Forgot Password */}
          <Pressable style={styles.forgotPasswordContainer} disabled={true}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </Pressable>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.signInButton,
              (!isFormValid || loginMutation.isPending) &&
                styles.signInButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isFormValid || loginMutation.isPending}
          >
            <Text style={styles.signInButtonText}>
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
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
            <SocialButton iconName='logo-facebook' />
            <SocialButton iconName='logo-google' />
            <SocialButton iconName='logo-apple' />
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't you have an account? </Text>
          <Pressable onPress={() => router.push('/onboarding-start')}>
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
    backgroundColor: Colors.background.primary,
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
    color: Colors.text.primary,
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
    backgroundColor: Colors.background.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
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
    color: Colors.text.error,
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
    color: Colors.text.secondary,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  signInButton: {
    backgroundColor: Colors.button.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  signInButtonDisabled: {
    backgroundColor: Colors.button.primary,
    opacity: 0.6,
  },
  signInButtonText: {
    color: Colors.text.primary,
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
    backgroundColor: Colors.border.primary,
  },
  dividerText: {
    color: Colors.text.secondary,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: Colors.text.secondary,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  signUpLink: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
})
