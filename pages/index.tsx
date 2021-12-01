import { useFrames } from 'components'
import { v4 as uuid } from 'uuid'
import { RapidEditor, RapidComponentPreview } from 'components/RapidEditor'
import { DEFAULT_COMPONENT_TREE } from 'components/RapidEditor/constants'
import { useRef } from 'react'

export default function Home() {
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
