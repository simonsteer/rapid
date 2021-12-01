import { MotionValue, useMotionValue } from 'framer-motion'
import { useEffectOnce } from 'react-use'

export function useMapMotionValue(
  source: MotionValue<number>,
  mapFn: (v: number) => number
) {
  const value = useMotionValue(mapFn(source.get()))
  useEffectOnce(() => source.onChange(v => value.set(mapFn(v))))

  return value
}
