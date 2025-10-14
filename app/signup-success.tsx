import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/colors'
import { commonStyles } from '@/constants/common-styles'
import { useUpdateProfile } from '@/hooks/useUser'
import { useOnboardingStore } from '@/store/onboardingStore'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
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
    <ThemedSafeAreaView style={commonStyles.screenContainer}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Sign up successfully!</ThemedText>
        <ThemedText style={styles.subtitle}>Tell us more about you</ThemedText>
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
            <ThemedText style={styles.errorText}>
              {errors.name.message}
            </ThemedText>
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
            <ThemedText style={styles.errorText}>
              {errors.phoneNumber.message}
            </ThemedText>
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
            <ThemedText style={styles.errorText}>
              {errors.city.message}
            </ThemedText>
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
          <ThemedText style={styles.continueButtonText}>
            {updateProfileMutation.isPending ? 'Saving...' : 'Continue'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 40,
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  formContainer: {
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
    fontFamily: 'Poppins_400Regular',
  },
  errorText: {
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
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
})
