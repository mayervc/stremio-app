import MenuIcon from '@/assets/icons/svg/menu-icon.svg'
import MoviesIcon from '@/assets/icons/svg/movies-icon.svg'
import PlayIcon from '@/assets/icons/svg/play-icon.svg'
import TicketsIcon from '@/assets/icons/svg/tickets-icon.svg'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
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

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index

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

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              isFocused && styles.tabItemActive,
              index > 0 && styles.tabItemSpacing,
            ]}
          >
            {!isFocused ? (
              <View style={styles.gradientBackground}>
                {/* Primer gradiente: vertical sólido #D9D9D9 */}
                <LinearGradient
                  colors={['#D9D9D9', '#D9D9D9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientLayer1}
                />
                {/* Segundo gradiente: diagonal #1F1F1F a #333333 */}
                <LinearGradient
                  colors={['#1F1F1F', '#333333']}
                  start={{ x: 0.059, y: 0 }}
                  end={{ x: 0.923, y: 0 }}
                  style={styles.gradientLayer2}
                />
                {renderIcon(tab.icon, 20, '#FFFFFF', index)}
              </View>
            ) : (
              <>
                {renderIcon(tab.icon, 24, '#FFFFFF', index)}
                <Text style={styles.tabLabel}>{tab.name}</Text>
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
    backgroundColor: '#1E1E1E',
    borderRadius: 41,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 82,
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
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    minWidth: 140,
    height: 58,
    borderWidth: 0,
  },
  tabLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabItemSpacing: {
    marginLeft: 10,
  },
})

export default CustomTabBar
