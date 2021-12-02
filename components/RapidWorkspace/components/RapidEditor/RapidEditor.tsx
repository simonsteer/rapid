import { RapidElementEditor, RapidTextNodeEditor } from './components'
import { RapidElementNode, RapidTextNode } from '../../types'
import { useRapidTreeLeaf } from '.'

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
