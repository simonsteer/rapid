import { DraggableProps } from 'framer-motion'
import { useList } from 'react-use'
import { Frame } from './components'
import { DEFAULT_WINDOW_CONFIG } from './constants'
import { FrameChild } from './types'

export default useFrames

export function useFrames(
  dragConstraints: NonNullable<DraggableProps['dragConstraints']>,
  initialFrames = [] as FrameChild[]
) {
  const [frames, list] = useList<FrameChild>(initialFrames)

  return {
    children: (
      <>
        {frames.map(
          ({
            x = DEFAULT_WINDOW_CONFIG.x,
            y = DEFAULT_WINDOW_CONFIG.y,
            width = DEFAULT_WINDOW_CONFIG.width,
            height = DEFAULT_WINDOW_CONFIG.height,
            id,
            children,
            title,
          }) => (
            <Frame
              destroy={() => list.filter(f => f.id !== id)}
              key={id}
              dragConstraints={dragConstraints}
              title={title}
              x={x}
              y={y}
              width={width}
              height={height}
            >
              {children}
            </Frame>
          )
        )}
      </>
    ),
    create: (child: FrameChild) => {
      if (!frames.some(f => f.id === child.id)) {
        list.push(child)
      }
    },
    destroy: (id: string) => {
      list.filter(frame => frame.id !== id)
    },
  }
}
