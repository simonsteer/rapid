import {
  motion,
  MotionStyle,
  MotionValue,
  PanHandlers,
  useDragControls,
  useMotionValue,
} from 'framer-motion'
import {
  CSSProperties,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure'
import { useEffectOnce, useList } from 'react-use'
import { minMax } from 'utils'
import classNames from 'classnames'
import { v4 as uuid } from 'uuid'

const HANDLE_THICKNESS = 4
const TITLE_HEIGHT = 34
const CLOSED_HEIGHT = TITLE_HEIGHT + HANDLE_THICKNESS * 2.25
const MIN_HEIGHT = 142
const MIN_WIDTH = 216

type FrameConfig = {
  id: string
  width: number
  height: number
  x: number
  y: number
}

export function Frames() {
  const [frames, actions] = useList<FrameConfig>([])

  const container = useRef<HTMLDivElement>(null)
  const createFrame = () => {
    const config: FrameConfig = {
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      id: uuid(),
    }
    actions.push(config)
  }
  const destroyFrame = (id: string) => {
    actions.filter(frame => frame.id !== id)
  }

  return (
    <div className="w-screen h-screen relative" ref={container}>
      {frames.map(config => (
        <FrameComponent
          destroyFrame={destroyFrame}
          key={config.id}
          container={container}
          title="MY TITLE"
          config={config}
        >
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
          <h1>hello world</h1>
        </FrameComponent>
      ))}
      <button
        onClick={createFrame}
        className="absolute bottom-5 right-5 py-3 px-6 rounded-md bg-lime-100 text-black"
      >
        create frame
      </button>
    </div>
  )
}

function FrameComponent({
  children,
  title,
  container,
  config,
  destroyFrame,
}: {
  children: ReactNode
  title: string
  container: RefObject<HTMLDivElement>
  config: FrameConfig
  destroyFrame: (id: string) => void
}) {
  const [zIndex, setZIndex] = useState<number>()
  const dragControls = useDragControls()
  const [draggable, setDraggable] = useState(true)
  const [open, setOpen] = useState(true)
  const width = useMotionValue(config.width)
  const height = useMotionValue(config.height)
  const x = useMotionValue(config.x)
  const y = useMotionValue(config.y)

  const prevHeight = useRef(height.get())
  const contentHeight = useMotionValue(getContentHeight(config.height))
  useEffectOnce(() =>
    height.onChange(height => contentHeight.set(getContentHeight(height)))
  )
  const contentWidth = useMotionValue(getContentWidth(config.width))
  useEffectOnce(() =>
    width.onChange(width => contentWidth.set(getContentWidth(width)))
  )

  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handlePointerDown(e: globalThis.PointerEvent) {
      if (
        e.target === panel.current ||
        panel.current?.contains(e.target as Node)
      ) {
        console.log('no draggies hehe')
        setDraggable(false)
      }
    }
    function handlePointerUp() {
      console.log('draggies hehe')
      setDraggable(true)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const handleProps: Omit<ResizeHandleProps, 'which'> = {
    width,
    height,
    x,
    y,
    open,
    setDraggable,
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
      drag={draggable}
      dragElastic={0}
      dragMomentum={false}
      dragConstraints={container}
      dragControls={dragControls}
      onPointerDown={() => setZIndex(performance.now())}
      className="overflow-hidden text-lime-500 absolute"
      style={{ zIndex, width, height, x, y }}
    >
      <motion.div className="bg-gray-700 h-full flex flex-col justify-between">
        <TopResizeHandles {...handleProps} />
        <div className="flex flex-1">
          <LeftResizeHandle {...handleProps} />
          <motion.div
            className="bg-black flex flex-col flex-1"
            style={{ width: contentWidth }}
          >
            <Disclosure open={open}>
              <DisclosureButton
                className="w-full"
                style={{ height: TITLE_HEIGHT }}
              >
                <div
                  className="flex items-center justify-between px-2"
                  style={{ height: 34 }}
                >
                  <p className="truncate">{title}</p>
                  <div className="flex">
                    <FrameTitleButton onClick={toggleVisibility}>
                      {open ? '-' : '+'}
                    </FrameTitleButton>
                    <FrameTitleButton
                      className="text-xs"
                      onClick={() => destroyFrame(config.id)}
                    >
                      x
                    </FrameTitleButton>
                  </div>
                </div>
              </DisclosureButton>
              <DisclosurePanel
                ref={panel}
                className="border-t border-dotted border-lime-500 flex-1"
              >
                <motion.div
                  style={{ height: contentHeight }}
                  className="px-2 pt-1 pb-2 overflow-y-scroll"
                >
                  {children}
                </motion.div>
              </DisclosurePanel>
            </Disclosure>
          </motion.div>
          <RightResizeHandle {...handleProps} />
        </div>
        <BottomResizeHandles {...handleProps} />
      </motion.div>
    </motion.div>
  )
}

const LeftResizeHandle = (props: Omit<ResizeHandleProps, 'which'>) => (
  <ResizeHandle {...props} which="left" />
)

const RightResizeHandle = (props: Omit<ResizeHandleProps, 'which'>) => (
  <ResizeHandle {...props} which="right" />
)

const TopResizeHandles = (props: Omit<ResizeHandleProps, 'which'>) => (
  <div className="flex">
    <ResizeHandle {...props} which="top-left" />
    <ResizeHandle {...props} which="top" />
    <ResizeHandle {...props} which="top-right" />
  </div>
)

const BottomResizeHandles = (props: Omit<ResizeHandleProps, 'which'>) => (
  <div className="flex">
    <ResizeHandle {...props} which="bottom-left" />
    <ResizeHandle {...props} which="bottom" />
    <ResizeHandle {...props} which="bottom-right" />
  </div>
)

type EdgeX = 'right' | 'left'
type EdgeY = 'top' | 'bottom'
type ResizeHandleType = EdgeX | EdgeY | `${EdgeY}-${EdgeX}`
type HandlePan = NonNullable<PanHandlers['onPan']>

type ResizeHandleProps = {
  which: ResizeHandleType
  width: MotionValue<number>
  height: MotionValue<number>
  x: MotionValue<number>
  y: MotionValue<number>
  open: boolean
  setDraggable: Dispatch<SetStateAction<boolean>>
}

function ResizeHandle({
  which,
  width,
  height,
  x,
  y,
  open,
  setDraggable,
}: ResizeHandleProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handlePointerDown(e: globalThis.PointerEvent) {
      if (e.target !== ref.current) return
      setDraggable(false)
    }
    function handlePointerUp() {
      setDraggable(true)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

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
        height.set(height.get() + pan.delta.y)
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

  return (
    <motion.div ref={ref} style={style} onPan={onPan} className={className} />
  )
}

function clampFrameHeight(val: number) {
  return minMax(val, MIN_HEIGHT, Infinity)
}

function clampFrameWidth(val: number) {
  return minMax(val, MIN_WIDTH, Infinity)
}

function getContentHeight(frameHeight: number) {
  return frameHeight - TITLE_HEIGHT - HANDLE_THICKNESS * 2.25
}

function getContentWidth(frameWidth: number) {
  return frameWidth - HANDLE_THICKNESS * 2
}

function FrameTitleButton({
  children,
  onClick,
  style,
  className,
}: {
  children: string
  onClick(): void
  style?: CSSProperties
  className?: string
}) {
  return (
    <span
      role="button"
      className={classNames(
        'bg-gray-900 w-5 h-5 mb-0.5 flex items-center justify-center mt-1 ml-2',
        className
      )}
      style={style}
      onClick={onClick}
    >
      <span>{children}</span>
    </span>
  )
}
