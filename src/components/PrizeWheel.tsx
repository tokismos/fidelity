import { colors } from "@/constants/colors"
import { WHEEL_SPIN_MS } from "@/constants/wheel"
import { WheelSlice } from "@/types"
import { landingRotation, sliceColor } from "@/utils/wheel"
import { useCallback, useEffect, useRef } from "react"
import { View } from "react-native"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg"
import { scheduleOnRN } from "react-native-worklets"

// Where the wheel must stop. Each new object starts a new spin, even on the same slice.
export type WheelLanding = {
  index: number
}

type Props = {
  slices: WheelSlice[]
  size: number
  landing: WheelLanding | null
  // Called when the wheel stops
  onLanded?: () => void
}

// Drawing units, from the mockup: the wheel is 300 wide, the pointer sits 14 above it
const VIEW = 300
const RIM = 146
const SLICE = 137
const LABEL = 88
const HUB = 24
const HUB_DOT = 7
const POINTER_TOP = 14

// Label color that reads on each slice color of `wheelColors`, in the same order
const LABEL_COLORS = [
  colors.white,
  colors.ink,
  colors.white,
  colors.ink,
  colors.ink,
  colors.roseInk,
  colors.white,
  colors.ink,
]

const labelColor = (index: number) => LABEL_COLORS[index % LABEL_COLORS.length]

// A point on a circle around the center, angle in degrees clockwise from the top
const point = (radius: number, angle: number) => {
  const radians = (angle * Math.PI) / 180
  return { x: radius * Math.sin(radians), y: -radius * Math.cos(radians) }
}

const slicePath = (start: number, end: number) => {
  const from = point(SLICE, start)
  const to = point(SLICE, end)
  const largeArc = end - start > 180 ? 1 : 0
  return `M 0 0 L ${from.x} ${from.y} A ${SLICE} ${SLICE} 0 ${largeArc} 1 ${to.x} ${to.y} Z`
}

// "+10" or the reward title, cut to fit the slice
const wheelLabel = (slice: WheelSlice, maxLength: number) => {
  const label = slice.points !== null ? `+${slice.points}` : (slice.reward?.title ?? "Prize")
  return label.length > maxLength ? `${label.slice(0, maxLength - 1)}…` : label
}

// The wheel only shows the prize the database picked: it turns until `landing` is under the pointer
export const PrizeWheel = ({ slices, size, landing, onLanded }: Props) => {
  const rotation = useSharedValue(0)
  // The latest callback, so a new function from the parent doesn't restart the spin
  const onLandedRef = useRef(onLanded)
  useEffect(() => {
    onLandedRef.current = onLanded
  }, [onLanded])
  const landed = useCallback(() => onLandedRef.current?.(), [])

  const scale = size / VIEW
  const angle = 360 / Math.max(1, slices.length)
  const isLarge = slices.length <= 4
  const fontSize = isLarge ? 19 : 16

  useEffect(() => {
    if (!landing) return
    rotation.value = withTiming(
      landingRotation(rotation.value, landing.index, slices.length),
      { duration: WHEEL_SPIN_MS, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) scheduleOnRN(landed)
      },
    )
  }, [landing, rotation, slices.length, landed])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }))

  return (
    <View style={{ width: size, height: size + POINTER_TOP * scale }} accessibilityLabel="Prize wheel">
      <Animated.View
        className="absolute left-0"
        style={[{ top: POINTER_TOP * scale, width: size, height: size }, animatedStyle]}
      >
        <Svg width={size} height={size} viewBox={`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`}>
          <Circle r={RIM} fill={colors.white} stroke={colors.line} strokeWidth={1} />
          {slices.length === 1 && <Circle r={SLICE} fill={sliceColor(0)} />}
          {slices.map((slice, index) => {
            const middle = (index + 0.5) * angle
            // Labels on the lower half are turned around so they never read upside down
            const flip = middle > 90 && middle < 270
            return (
              <G key={slice.id}>
                {slices.length > 1 && (
                  <Path
                    d={slicePath(index * angle, (index + 1) * angle)}
                    fill={sliceColor(index)}
                    stroke={colors.white}
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                  />
                )}
                <G transform={`rotate(${middle})`}>
                  <SvgText
                    x={0}
                    y={-LABEL + fontSize * 0.35}
                    fill={labelColor(index)}
                    fontSize={fontSize}
                    fontFamily={isLarge ? "RedHatDisplay_900Black" : "RedHatDisplay_700Bold"}
                    textAnchor="middle"
                    transform={flip ? `rotate(180 0 ${-LABEL})` : undefined}
                  >
                    {wheelLabel(slice, isLarge ? 11 : 9)}
                  </SvgText>
                </G>
              </G>
            )
          })}
          <Circle r={HUB} fill={colors.white} stroke={colors.line} strokeWidth={1.5} />
          <Circle r={HUB_DOT} fill={colors.ink} />
        </Svg>
      </Animated.View>
      <View className="absolute left-0 top-0" pointerEvents="none">
        <Svg width={size} height={50 * scale} viewBox={`${-VIEW / 2} ${-VIEW / 2 - POINTER_TOP} ${VIEW} 50`}>
          <Path
            d="M -13 -160 h 26 l -13 30 z"
            fill={colors.ink}
            stroke={colors.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </View>
  )
}
