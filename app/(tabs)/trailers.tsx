import { StyleSheet, View } from 'react-native'

import HeaderBar from '@/components/header-bar'
import { LogoutButton } from '@/components/logout-button'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'

export default function TrailersScreen() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <HeaderBar />
      <View style={styles.content}>
        <ThemedText style={styles.title}>Trailers</ThemedText>
        <ThemedText style={styles.subtitle}>
          This is the Trailers screen. Content coming soon...
        </ThemedText>
        <LogoutButton />
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
})
