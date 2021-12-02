import { useFrames } from 'components'
import { useRef } from 'react'
import {
  RapidComponentPreview,
  RapidEditor,
  RapidEditorProvider,
  useRapidComponent,
} from './components'
import { RapidElementNode } from './types'

export default Rapid

export function Rapid({ component }: { component: RapidElementNode }) {
  return (
    <RapidEditorProvider component={component}>
      <RapidWorkspace />
    </RapidEditorProvider>
  )
}

export function RapidWorkspace() {
  const component = useRapidComponent()

  const ref = useRef<HTMLDivElement>(null)
  const frames = useFrames(ref, [
    {
      id: `${component.id}-preview`,
      children: <RapidComponentPreview />,
      title: 'Preview',
      width: 400,
      height: 350,
      x: 700,
      y: 50,
    },
    {
      id: `${component.id}-editor`,
      children: <RapidEditor id="root" />,
      title: 'Editor',
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
