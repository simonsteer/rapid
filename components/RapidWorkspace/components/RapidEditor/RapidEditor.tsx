import { RapidElementEditor, RapidTextNodeEditor } from './components'
import { RapidElementNode, RapidTextNode } from '../../types'
import { RapidEditorProvider, useRapidEditor } from './hooks'

export function RapidEditor({
  component,
  root,
}: {
  component: RapidElementNode | RapidTextNode
  root?: boolean
}) {
  switch (component.type) {
    case 'element':
      return <RapidElementEditor component={component} root={root} />
    case 'text':
      return (
        <RapidTextNodeEditor
          text={component.data.text}
          setText={console.log}
          component={component}
        />
      )
    default:
      return null
  }
}
