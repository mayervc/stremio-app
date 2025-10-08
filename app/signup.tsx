import { SocialButton } from '@/components/social-button'
import { Colors } from '@/constants/colors'
import { useSignup } from '@/hooks/useAuth'
import { useOnboardingData } from '@/hooks/useOnboardingData'
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

// Validation schema
const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const signupMutation = useSignup()
  const { selectedGenres } = useOnboardingData()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  })

  // Watch form values to determine if signup button should be enabled
  const watchedValues = watch()
  const isFormValid =
    isValid &&
    watchedValues.email &&
    watchedValues.password &&
    watchedValues.confirmPassword

  // Condition to disable the signup button
  const isSignupDisabled = !isFormValid || signupMutation.isPending

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate({
      email: data.email,
      password: data.password,
      selectedGenres: selectedGenres,
    })
  }

  const handleLoginPress = () => {
    router.push('/login')
  }

  const handlePrivacyPolicyPress = () => {
    // TODO: Navigate to privacy policy
    console.log('Privacy Policy pressed')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Already have account link */}
      <View style={styles.header}>
        <Pressable onPress={handleLoginPress}>
          <Text style={styles.headerLink}>Already have an account? Log in</Text>
        </Pressable>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign Up</Text>
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

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <Controller
                control={control}
                name='confirmPassword'
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder='Confirm Password'
                    placeholderTextColor={Colors.placeholder}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize='none'
                    autoCorrect={false}
                  />
                )}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.icon.primary}
                />
              </Pressable>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              isSignupDisabled && styles.signUpButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSignupDisabled}
          >
            <Text style={styles.signUpButtonText}>
              {signupMutation.isPending ? 'Signing up...' : 'Sign up'}
            </Text>
          </TouchableOpacity>

          {/* Terms and Privacy Policy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By clicking the "sign up" button, you accept the terms of the{' '}
              <Pressable onPress={handlePrivacyPolicyPress}>
                <Text style={styles.privacyLink}>Privacy Policy</Text>
              </Pressable>
            </Text>
          </View>

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

        {/* Footer - Already have account link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={handleLoginPress}>
            <Text style={styles.footerLink}>Sign In</Text>
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
  },
  header: {
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  headerLink: {
    color: Colors.text.secondary,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text.primary,
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
  signUpButton: {
    backgroundColor: Colors.button.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonDisabled: {
    backgroundColor: Colors.button.primary,
    opacity: 0.6,
  },
  signUpButtonText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  termsContainer: {
    marginBottom: 30,
  },
  termsText: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  privacyLink: {
    color: Colors.text.primary,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  footerLink: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
})
