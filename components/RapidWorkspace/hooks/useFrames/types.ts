import { PanHandlers, MotionValue, DraggableProps } from 'framer-motion'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export type ResizeHandleProps = {
  which: ResizeHandleType
  width: MotionValue<number>
  height: MotionValue<number>
  x: MotionValue<number>
  y: MotionValue<number>
  open: boolean
  setIsResizing: Dispatch<SetStateAction<boolean>>
}

export type FrameProps = {
  children: ReactNode
  title: string
  dragConstraints: NonNullable<DraggableProps['dragConstraints']>
  width: number
  height: number
  x: number
  y: number
  destroy(): void
}

export type FrameChild = {
  id: string
  title: string
  children: ReactNode
  x?: number
  y?: number
  width?: number
  height?: number
}

export type EdgeX = 'right' | 'left'
export type EdgeY = 'top' | 'bottom'
export type ResizeHandleType = EdgeX | EdgeY | `${EdgeY}-${EdgeX}`
export type HandlePan = NonNullable<PanHandlers['onPan']>
