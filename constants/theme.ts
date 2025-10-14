/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native'

const tintColorLight = '#007AFF'
const tintColorDark = '#FF3B30'

export const Colors = {
  light: {
    // Text colors
    textPrimary: '#1C1C1E',
    textSecondary: '#6E6E73',
    textError: '#FF3B30',

    // Background colors
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    backgroundInput: '#F2F2F7',

    // Border colors
    borderPrimary: '#D1D1D6',
    borderSecondary: '#007AFF',

    // Button colors
    buttonPrimary: '#FF3B30',
    buttonSocial: '#F2F2F7',

    // Other
    placeholder: '#6E6E73',
    iconPrimary: '#6E6E73',
    iconSocial: '#1C1C1E',

    // Legacy (for compatibility)
    text: '#1C1C1E',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6E6E73',
    tabIconDefault: '#6E6E73',
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    textError: '#FF3B30',

    // Background colors
    backgroundPrimary: '#121011',
    backgroundSecondary: '#2C2C2E',
    backgroundInput: '#121011',

    // Border colors
    borderPrimary: '#3A3A3C',
    borderSecondary: '#007AFF',

    // Button colors
    buttonPrimary: '#FF3B30',
    buttonSocial: '#2C2C2E',

    // Other
    placeholder: '#8E8E93',
    iconPrimary: '#8E8E93',
    iconSocial: '#FFFFFF',

    // Legacy (for compatibility)
    text: '#FFFFFF',
    background: '#121011',
    tint: tintColorDark,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
  },
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
})
