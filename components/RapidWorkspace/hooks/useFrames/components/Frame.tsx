import { motion, useDragControls, useMotionValue } from 'framer-motion'
import React, { ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure'
import {
  TopHandles,
  RightHandles,
  BottomHandles,
  LeftHandles,
} from './ResizeHandles'
import { FrameTitleButton } from './FrameTitleButton'
import { ResizeHandleProps, FrameProps, HandlePan } from '../types'
import { CLOSED_HEIGHT, TITLE_HEIGHT } from '../constants'
import { getContentHeight, getContentWidth } from '../utils'
import { useMapMotionValue } from '../../useMapMotionValue'
import classNames from 'classnames'

export function Frame({
  children,
  title,
  dragConstraints,
  destroy,
  ...geometry
}: FrameProps) {
  const [zIndex, setZIndex] = useState(performance.now())
  const [isResizing, setIsResizing] = useState(false)
  const [open, setOpen] = useState(true)
  const width = useMotionValue(geometry.width)
  const height = useMotionValue(geometry.height)
  const { x, y, onPan } = useDragHandle(geometry)

  const prevHeight = useRef(height.get())
  const contentHeight = useMapMotionValue(height, getContentHeight)
  const contentWidth = useMapMotionValue(width, getContentWidth)

  const panel = useRef<HTMLDivElement>(null)

  const handleProps: Omit<ResizeHandleProps, 'which'> = {
    width,
    height,
    x,
    y,
    open,
    setIsResizing,
  }

  function hideContents() {
    prevHeight.current = height.get()
    height.set(CLOSED_HEIGHT)
    setOpen(false)
  }

  function showContents() {
    height.set(prevHeight.current)
    setOpen(true)
  }

  function toggleVisibility() {
    if (open) hideContents()
    else showContents()
  }

  return (
    <motion.div
      onPointerDown={() => setZIndex(performance.now())}
      className={classNames(
        'overflow-hidden text-black absolute rounded-lg border border-black',
        'transition-shadow hover:shadow-lg',
        isResizing && 'select-none'
      )}
      style={{ zIndex, width, height, x, y }}
    >
      <motion.div className="h-full flex flex-col justify-between transition-colors bg-white hover:bg-gray-100">
        <TopHandles {...handleProps} />
        <div className="flex flex-1">
          <LeftHandles {...handleProps} />
          <motion.div
            className="flex flex-col flex-1 bg-white rounded-sm"
            style={{ width: contentWidth }}
          >
            <Disclosure open={open}>
              <motion.div
                onPan={onPan}
                className="w-full cursor-move flex items-center justify-between pl-2 pr-1.5"
                style={{ height: TITLE_HEIGHT }}
              >
                <p className="truncate">{title}</p>
                <div className="flex items-center">
                  <DisclosureButton
                    className="w-5 h-5 flex items-center justify-center ml-1.5 transition-colors bg-white border border-transparent focus:border-gray-400 border-dotted hover:bg-gray-200 rounded-sm"
                    onClick={toggleVisibility}
                  >
                    {open ? '-' : '+'}
                  </DisclosureButton>
                  <FrameTitleButton className="text-xs" onClick={destroy}>
                    x
                  </FrameTitleButton>
                </div>
              </motion.div>
              <DisclosurePanel
                ref={panel}
                className="border-t border-black border-dashed flex-1"
              >
                <motion.div
                  style={{ height: contentHeight }}
                  className="py-2 mx-2 overflow-scroll no-scrollbar"
                >
                  {children}
                </motion.div>
              </DisclosurePanel>
            </Disclosure>
          </motion.div>
          <RightHandles {...handleProps} />
        </div>
        <BottomHandles {...handleProps} />
      </motion.div>
    </motion.div>
  )
}

function useDragHandle(
  { x = 0, y = 0 } = {} as Partial<{ [Axis in 'x' | 'y']: number }>
) {
  const _x = useMotionValue(x)
  const _y = useMotionValue(y)

  const onPan: HandlePan = (e, pan) => {
    e.preventDefault()
    _x.set(_x.get() + pan.delta.x)
    _y.set(_y.get() + pan.delta.y)
  }

  return { x: _x, y: _y, onPan } as const
}
