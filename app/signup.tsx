import { SocialButton } from '@/components/social-button'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/colors'
import { commonStyles } from '@/constants/common-styles'
import { useSignup } from '@/hooks/useAuth'
import { useOnboardingStore } from '@/store/onboardingStore'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Pressable,
  StyleSheet,
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
  const { setCurrentStep } = useOnboardingStore()

  useEffect(() => {
    setCurrentStep(3)
  }, [setCurrentStep])

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
    <ThemedSafeAreaView style={commonStyles.screenContainer}>
      {/* Header - Already have account link */}
      <View style={styles.header}>
        <Pressable onPress={handleLoginPress}>
          <ThemedText style={styles.headerLink}>
            Already have an account? Log in
          </ThemedText>
        </Pressable>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Sign Up</ThemedText>
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
              <ThemedText style={styles.errorText}>
                {errors.email.message}
              </ThemedText>
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
              <ThemedText style={styles.errorText}>
                {errors.password.message}
              </ThemedText>
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
              <ThemedText style={styles.errorText}>
                {errors.confirmPassword.message}
              </ThemedText>
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
            <ThemedText type='button' style={styles.signUpButtonText}>
              {signupMutation.isPending ? 'Signing up...' : 'Sign up'}
            </ThemedText>
          </TouchableOpacity>

          {/* Terms and Privacy Policy */}
          <View style={styles.termsContainer}>
            <ThemedText style={styles.termsText}>
              By clicking the "sign up" button, you accept the terms of the{' '}
              <ThemedText
                style={styles.privacyLink}
                onPress={handlePrivacyPolicyPress}
              >
                Privacy Policy
              </ThemedText>
            </ThemedText>
          </View>

          {/* Or Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>or</ThemedText>
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
          <ThemedText style={styles.footerText}>
            Already have an account?{' '}
          </ThemedText>
          <Pressable onPress={handleLoginPress}>
            <ThemedText style={styles.footerLink}>Sign In</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  headerLink: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
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
    backgroundColor: 'transparent',
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
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  termsContainer: {
    marginBottom: 32,
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'left',
    lineHeight: 20,
    marginLeft: 0,
    paddingLeft: 0,
  },
  privacyLink: {
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
    marginBottom: 32, // Move up from bottom
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  footerLink: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
})
