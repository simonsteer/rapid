import { motion, MotionStyle } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'
import { HandlePan, ResizeHandleProps } from '../types'
import { HANDLE_THICKNESS } from '../constants'
import { clampFrameHeight, clampFrameWidth } from '../utils'

export const LeftHandles = (props: Omit<ResizeHandleProps, 'which'>) => (
  <ResizeHandle {...props} which="left" />
)

export const RightHandles = (props: Omit<ResizeHandleProps, 'which'>) => (
  <ResizeHandle {...props} which="right" />
)

export const TopHandles = (props: Omit<ResizeHandleProps, 'which'>) => (
  <div className="flex">
    <ResizeHandle {...props} which="top-left" />
    <ResizeHandle {...props} which="top" />
    <ResizeHandle {...props} which="top-right" />
  </div>
)

export const BottomHandles = (props: Omit<ResizeHandleProps, 'which'>) => (
  <div className="flex">
    <ResizeHandle {...props} which="bottom-left" />
    <ResizeHandle {...props} which="bottom" />
    <ResizeHandle {...props} which="bottom-right" />
  </div>
)

function ResizeHandle({
  which,
  width,
  height,
  x,
  y,
  open,
  setIsResizing,
}: ResizeHandleProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handlePointerDown(e: globalThis.PointerEvent) {
      if (e.target !== ref.current) return
      setIsResizing(true)
    }
    function handlePointerUp() {
      setIsResizing(false)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const { onPan, style, className } = useMemo(() => {
    let className = 'flex-shrink-0'
    let onPan: HandlePan = e => {
      e.preventDefault()
    }
    let style: MotionStyle = {}

    switch (which) {
      case 'top':
        style.height = HANDLE_THICKNESS
        style.width = `calc(100% - ${HANDLE_THICKNESS * 2}px)`
        if (!open) break

        className += ' cursor-ns-resize'
        onPan = (e, pan) => {
          e.preventDefault()

          const currentHeight = height.get()
          const nextHeight = clampFrameHeight(currentHeight - pan.delta.y)
          const diffY = nextHeight - currentHeight
          y.set(y.get() - diffY)
          height.set(nextHeight)
        }
        break
      case 'bottom':
        style.height = HANDLE_THICKNESS
        style.width = `calc(100% - ${HANDLE_THICKNESS * 2}px)`
        if (!open) break

        className += ' cursor-ns-resize'
        onPan = (e, pan) => {
          e.preventDefault()
          const currentHeight = height.get()
          const nextHeight = clampFrameHeight(currentHeight + pan.delta.y)
          height.set(nextHeight)
        }
        break
      case 'left':
        style.width = HANDLE_THICKNESS
        className += ' cursor-ew-resize'
        onPan = (e, pan) => {
          e.preventDefault()
          const currentWidth = width.get()
          const nextWidth = clampFrameWidth(currentWidth - pan.delta.x)
          const diffX = nextWidth - currentWidth
          x.set(x.get() - diffX)
          width.set(nextWidth)
        }
        break
      case 'right':
        style.width = HANDLE_THICKNESS
        className += ' cursor-ew-resize'
        onPan = (e, pan) => {
          e.preventDefault()
          const currentWidth = width.get()
          const nextWidth = clampFrameWidth(currentWidth + pan.delta.x)
          width.set(nextWidth)
        }
        break
      case 'top-right':
        style.width = HANDLE_THICKNESS
        style.height = HANDLE_THICKNESS
        if (!open) break

        className += ' cursor-nesw-resize'
        onPan = (e, pan) => {
          e.preventDefault()

          const currentHeight = height.get()
          const nextHeight = clampFrameHeight(currentHeight - pan.delta.y)
          const diffY = nextHeight - currentHeight

          const currentWidth = width.get()
          const nextWidth = clampFrameWidth(currentWidth + pan.delta.x)

          y.set(y.get() - diffY)
          height.set(nextHeight)
          width.set(nextWidth)
        }
        break
      case 'top-left':
        style.width = HANDLE_THICKNESS
        style.height = HANDLE_THICKNESS
        if (!open) break

        className += ' cursor-nwse-resize'
        onPan = (e, pan) => {
          e.preventDefault()

          const currentHeight = height.get()
          const nextHeight = clampFrameHeight(currentHeight - pan.delta.y)
          const diffY = nextHeight - currentHeight

          const currentWidth = width.get()
          const nextWidth = clampFrameWidth(currentWidth - pan.delta.x)
          const diffX = nextWidth - currentWidth

          y.set(y.get() - diffY)
          x.set(x.get() - diffX)
          height.set(nextHeight)
          width.set(nextWidth)
        }
        break
      case 'bottom-right':
        style.width = HANDLE_THICKNESS
        style.height = HANDLE_THICKNESS
        if (!open) break

        className += ' cursor-nwse-resize'
        onPan = (e, pan) => {
          e.preventDefault()

          const currentHeight = height.get()
          const nextHeight = clampFrameHeight(currentHeight + pan.delta.y)

          const currentWidth = width.get()
          const nextWidth = clampFrameWidth(currentWidth + pan.delta.x)

          height.set(nextHeight)
          width.set(nextWidth)
        }
        break
      case 'bottom-left':
        style.width = HANDLE_THICKNESS
        style.height = HANDLE_THICKNESS
        if (!open) break

        className += ' cursor-nesw-resize'
        onPan = (e, pan) => {
          e.preventDefault()

          const currentHeight = height.get()
          const nextHeight = clampFrameHeight(currentHeight + pan.delta.y)

          const currentWidth = width.get()
          const nextWidth = clampFrameWidth(currentWidth - pan.delta.x)
          const diffX = nextWidth - currentWidth

          x.set(x.get() - diffX)
          height.set(nextHeight)
          width.set(nextWidth)
        }
        break
      default:
        break
    }

    return { onPan, style, className }
  }, [which, open])

  return (
    <motion.div ref={ref} style={style} onPan={onPan} className={className} />
  )
}
