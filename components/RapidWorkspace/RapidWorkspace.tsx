import { useFrames } from 'components'
import { useRef } from 'react'
import { RapidComponentPreview, RapidEditor } from './components'
import { DEFAULT_COMPONENT_TREE } from './constants'
import { v4 as uuid } from 'uuid'

export default RapidWorkspace

export function RapidWorkspace() {
  const ref = useRef<HTMLDivElement>(null)
  const frames = useFrames(ref, [
    {
      id: uuid(),
      children: <RapidComponentPreview component={DEFAULT_COMPONENT_TREE} />,
      title: 'Preview',
      width: 400,
      height: 350,
      x: 700,
      y: 50,
    },
    {
      id: uuid(),
      children: <RapidEditor root component={DEFAULT_COMPONENT_TREE} />,
      title: 'Markdown',
      width: 600,
      height: 700,
      x: 50,
      y: 50,
    },
  ])

  return (
    <div className="w-screen h-screen reltive" ref={ref}>
      {frames.children}
    </div>
  )
}
