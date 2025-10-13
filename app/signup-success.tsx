import { Colors } from '@/constants/colors'
import { useUpdateProfile } from '@/hooks/useUser'
import { useOnboardingStore } from '@/store/onboardingStore'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { z } from 'zod'

// Validation schema
const userInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  city: z.string().min(1, 'City is required'),
})

type UserInfoFormData = z.infer<typeof userInfoSchema>

export default function SignupSuccessScreen() {
  const { selectedGenres } = useOnboardingStore()
  const updateProfileMutation = useUpdateProfile()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    mode: 'onChange',
  })

  // Watch form values to determine if continue button should be enabled
  const watchedValues = watch()
  const isFormValid =
    isValid &&
    watchedValues.name &&
    watchedValues.phoneNumber &&
    watchedValues.city

  // Condition to disable the continue button
  const isContinueDisabled = !isFormValid || updateProfileMutation.isPending

  const onSubmit = (data: UserInfoFormData) => {
    // Split name into firstName and lastName
    const nameParts = data.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Update user profile with form data and selected genres
    updateProfileMutation.mutate({
      firstName,
      lastName,
      phoneNumber: data.phoneNumber,
      city: data.city,
      genres: selectedGenres,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign up successfully!</Text>
        <Text style={styles.subtitle}>Tell us more about you</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder='Your name'
                placeholderTextColor={Colors.placeholder}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize='words'
                autoCorrect={false}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name='phoneNumber'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder='Your phone number'
                placeholderTextColor={Colors.placeholder}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType='phone-pad'
                autoCorrect={false}
              />
            )}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
          )}
        </View>

        {/* City Input */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name='city'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder='City'
                placeholderTextColor={Colors.placeholder}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize='words'
                autoCorrect={false}
              />
            )}
          />
          {errors.city && (
            <Text style={styles.errorText}>{errors.city.message}</Text>
          )}
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            isContinueDisabled && styles.continueButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isContinueDisabled}
        >
          <Text style={styles.continueButtonText}>
            {updateProfileMutation.isPending ? 'Saving...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text.secondary,
  },
  formContainer: {
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
    fontFamily: 'Poppins_400Regular',
  },
  errorText: {
    color: Colors.text.error,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: Colors.button.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.button.primary,
    opacity: 0.6,
  },
  continueButtonText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
})
