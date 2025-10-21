import { StyleSheet, View } from 'react-native'

import HeaderBar from '@/components/header-bar'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function TicketsScreen() {
  return (
    <ThemedView style={styles.container}>
      <HeaderBar
        userName='User'
        onSearchPress={() => console.log('Search pressed')}
        onProfilePress={() => console.log('Profile pressed')}
      />
      <View style={styles.content}>
        <ThemedText style={styles.title}>Tickets</ThemedText>
        <ThemedText style={styles.subtitle}>
          This is the Tickets screen. Content coming soon...
        </ThemedText>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121011',
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
