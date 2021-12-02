import { useRapidTreeLeaf } from './context'
import { RapidElementEditor } from './RapidElementEditor'
import { RapidTextNodeEditor } from './RapidTextNodeEditor'

export function RapidEditor({ id }: { id: string }) {
  const component = useRapidTreeLeaf(id)

  switch (component.type) {
    case 'element':
      return <RapidElementEditor id={id} />
    case 'text':
      return <RapidTextNodeEditor id={id} />
    default:
      return null
  }
}
