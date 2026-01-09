import { SocialButton } from '@/components/social-button'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/colors'
import { commonStyles } from '@/constants/common-styles'
import { useLogin } from '@/hooks/useAuth'
import { logError, logMessage } from '@/lib/sentry'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Pressable,
  StyleSheet,
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
  // const insets = useSafeAreaInsets()

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
    logMessage('Login form submitted', 'info', {
      email: data.email,
    })
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    })
  }

  const handleSignUpPress = () => {
    router.push('/signup')
  }

  // Función temporal para probar Sentry - ELIMINAR después de probar
  const handleTestSentry = () => {
    logError(new Error('🧪 Error de prueba de Sentry desde stremio-app'), {
      context: 'testing',
      action: 'test-sentry-integration',
      screen: 'login',
    })
    alert('✅ Error enviado a Sentry! Revisa tu dashboard en unos segundos.')
  }

  return (
    <ThemedSafeAreaView style={commonStyles.screenContainer}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Sign In</ThemedText>
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

          {/* Forgot Password */}
          <Pressable style={styles.forgotPasswordContainer} disabled={true}>
            <ThemedText style={styles.forgotPasswordText}>
              Forgot password?
            </ThemedText>
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
            <ThemedText type='button' style={styles.signInButtonText}>
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </ThemedText>
          </TouchableOpacity>

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

          {/* BOTÓN TEMPORAL PARA PROBAR SENTRY - ELIMINAR DESPUÉS */}
          <TouchableOpacity
            style={styles.testSentryButton}
            onPress={handleTestSentry}
          >
            <ThemedText style={styles.testSentryButtonText}>
              🧪 Probar Sentry (Temporal)
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <ThemedText style={styles.signUpText}>
            Don't you have an account?{' '}
          </ThemedText>
          <Pressable onPress={handleSignUpPress}>
            <ThemedText style={styles.signUpLink}>Sign Up</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
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
    marginBottom: 100, // Move up from bottom
  },
  signUpText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  signUpLink: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  // Estilos temporales para el botón de prueba - ELIMINAR después
  testSentryButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#FF4757',
  },
  testSentryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
  },
})
