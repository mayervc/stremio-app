const AsyncStorage =
  require('@react-native-async-storage/async-storage').default

async function clearStorage() {
  try {
    await AsyncStorage.clear()
    console.log('✅ AsyncStorage cleared successfully')
  } catch (error) {
    console.error('❌ Error clearing AsyncStorage:', error)
  }
}

clearStorage()
