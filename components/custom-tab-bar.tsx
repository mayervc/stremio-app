import MenuIcon from '@/assets/icons/svg/menu-icon.svg'
import MoviesIcon from '@/assets/icons/svg/movies-icon.svg'
import PlayIcon from '@/assets/icons/svg/play-icon.svg'
import TicketsIcon from '@/assets/icons/svg/tickets-icon.svg'
import { ThemedText } from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View } from 'react-native'

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const iconColor = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'text')
  const tabBarBackgroundColor = useThemeColor(
    { light: '#F5F5F5', dark: '#1E1E1E' },
    'background'
  )
  const activeTabBackgroundColor = useThemeColor(
    { light: '#FF3B30', dark: '#FF3B30' },
    'tint'
  )
  const gradientColor1 = useThemeColor(
    { light: '#E0E0E0', dark: '#D9D9D9' },
    'background'
  )
  const gradientColor2 = useThemeColor(
    { light: '#1F1F1F', dark: '#1F1F1F' },
    'text'
  )
  const gradientColor3 = useThemeColor(
    { light: '#333333', dark: '#333333' },
    'text'
  )

  const tabConfig = [
    {
      name: 'Movies',
      icon: MoviesIcon,
    },
    {
      name: 'Trailers',
      icon: PlayIcon,
    },
    {
      name: 'Tickets',
      icon: TicketsIcon,
    },
    {
      name: 'Menu',
      icon: MenuIcon,
    },
  ]

  const renderIcon = (
    IconComponent: any,
    size: number,
    color: string,
    index: number
  ) => {
    const Icon = IconComponent
    let width, height

    if (index === 0) {
      // Movies
      width = 24
      height = 20
    } else if (index === 1) {
      // Play/Trailers
      width = 28
      height = 18
    } else if (index === 2) {
      // Tickets
      width = 33.5
      height = 24.7
    } else {
      // Menu
      width = 25
      height = 20
    }

    return <Icon width={width} height={height} color={color} />
  }

  // Check if current route should hide tab bar - if so, hide the entire tab bar
  const currentRoute = state.routes[state.index]
  const hiddenRoutes = [
    'search',
    'movie/[id]',
    'actor/[id]',
    'showtimes/[movieId]',
  ]
  if (currentRoute && hiddenRoutes.includes(currentRoute.name)) {
    return null
  }

  return (
    <View style={[styles.tabBar, { backgroundColor: tabBarBackgroundColor }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index

        // Skip routes that should not be displayed in tab bar (like search)
        // Check if route name is in the list of hidden routes
        if (hiddenRoutes.includes(route.name)) {
          return null
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const tab = tabConfig[index]

        // Safety check: if tab doesn't exist, don't render
        if (!tab) {
          return null
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              isFocused && [
                styles.tabItemActive,
                { backgroundColor: activeTabBackgroundColor },
              ],
              index > 0 && styles.tabItemSpacing,
            ]}
          >
            {!isFocused ? (
              <View style={styles.gradientBackground}>
                <LinearGradient
                  colors={[gradientColor1, gradientColor1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientLayer1}
                />
                <LinearGradient
                  colors={[gradientColor2, gradientColor3]}
                  start={{ x: 0.059, y: 0 }}
                  end={{ x: 0.923, y: 0 }}
                  style={styles.gradientLayer2}
                />
                {renderIcon(tab.icon, 20, iconColor, index)}
              </View>
            ) : (
              <>
                {renderIcon(tab.icon, 24, iconColor, index)}
                <ThemedText style={styles.tabLabel}>{tab.name}</ThemedText>
              </>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderRadius: 36,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 29,
    width: 58,
    height: 58,
    borderWidth: 0,
  },
  gradientBackground: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gradientLayer1: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  gradientLayer2: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  tabIcon: {
    zIndex: 1,
  },
  tabItemActive: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    minWidth: 140,
    height: 58,
    borderWidth: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabItemSpacing: {
    marginLeft: 10,
  },
})

export default CustomTabBar
