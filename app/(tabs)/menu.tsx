import { StyleSheet, View } from 'react-native'

import HeaderBar from '@/components/header-bar'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'

export default function MenuScreen() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <HeaderBar />
      <View style={styles.content}>
        <ThemedText style={styles.title}>Menu</ThemedText>
        <ThemedText style={styles.subtitle}>
          Menu functionality coming soon...
        </ThemedText>
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
