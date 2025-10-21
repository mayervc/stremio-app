import { Tabs } from 'expo-router'
import React from 'react'

import CustomTabBar from '@/components/custom-tab-bar'

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Movies',
        }}
      />
      <Tabs.Screen
        name='trailers'
        options={{
          title: 'Trailers',
        }}
      />
      <Tabs.Screen
        name='tickets'
        options={{
          title: 'Tickets',
        }}
      />
      <Tabs.Screen
        name='menu'
        options={{
          title: 'Menu',
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault()
            console.log('Menu tab pressed - custom behavior')
            // Aquí puedes agregar las acciones personalizadas que necesites
          },
        }}
      />
    </Tabs>
  )
}
