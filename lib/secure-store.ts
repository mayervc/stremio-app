import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

export const tokenStorage = {
  async setToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('auth_token', token)
    } else {
      await SecureStore.setItemAsync('auth_token', token)
    }
  },

  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem('auth_token')
    } else {
      return await SecureStore.getItemAsync('auth_token')
    }
  },

  async removeToken(): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('auth_token')
    } else {
      await SecureStore.deleteItemAsync('auth_token')
    }
  },
}
