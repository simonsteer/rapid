import { minMax } from 'utils'
import {
  HANDLE_THICKNESS,
  MIN_HEIGHT,
  MIN_WIDTH,
  TITLE_HEIGHT,
} from './constants'

export function getContentHeight(frameHeight: number) {
  return frameHeight - TITLE_HEIGHT - HANDLE_THICKNESS * 2.5 + 1
}

export function getContentWidth(frameWidth: number) {
  return frameWidth - HANDLE_THICKNESS * 2
}

export function clampFrameHeight(val: number) {
  return minMax(val, MIN_HEIGHT, Infinity)
}

export function clampFrameWidth(val: number) {
  return minMax(val, MIN_WIDTH, Infinity)
}
