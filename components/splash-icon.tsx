import React from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { G, Polygon, Rect } from 'react-native-svg'

export function SplashIcon({ size = 200 }: { size?: number }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox='0 0 200 200'>
        <G transform='translate(100, 100)'>
          {/* Main rounded rectangle (video player base) */}
          <Rect
            x={-60}
            y={-40}
            width={120}
            height={80}
            rx={12}
            ry={12}
            fill='white'
          />

          {/* Clapperboard slats at the top */}
          <G transform='translate(-60, -40)'>
            <Rect
              x={8}
              y={0}
              width={2}
              height={8}
              fill='white'
              transform='rotate(-15 9 4)'
            />
            <Rect
              x={18}
              y={0}
              width={2}
              height={8}
              fill='white'
              transform='rotate(-12 19 4)'
            />
            <Rect
              x={28}
              y={0}
              width={2}
              height={8}
              fill='white'
              transform='rotate(-9 29 4)'
            />
            <Rect
              x={38}
              y={0}
              width={2}
              height={8}
              fill='white'
              transform='rotate(-6 39 4)'
            />
            <Rect
              x={48}
              y={0}
              width={2}
              height={8}
              fill='white'
              transform='rotate(-3 49 4)'
            />
          </G>

          {/* Play button triangle (centered, slightly to the right) */}
          <Polygon points='10,0 10,30 -15,15' fill='white' />
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
