import { useThemeColor } from '@/hooks/use-theme-color'
import { type ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
}

export function ThemedSafeAreaView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'backgroundPrimary'
  )

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />
}
