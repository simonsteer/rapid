import classNames from 'classnames'
import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { useDeleteRapidNode } from '.'
import { useRapidTreeNode } from './context'
import { RapidElementEditor } from './RapidElementEditor'
import { RapidTextNodeEditor } from './RapidTextNodeEditor'

export type EditorVariant = 'initial' | 'hovering'

export function RapidEditor({
  id,
  outerVariant,
}: {
  id: string
  outerVariant?: EditorVariant
}) {
  const [variant, setVariant] = useState<EditorVariant>('initial')
  const variantToRender = outerVariant === 'hovering' ? outerVariant : variant

  const component = useRapidTreeNode(id)
  const deleteNode = useDeleteRapidNode()

  let children: ReactNode
  switch (component.type) {
    case 'element':
      children = (
        <RapidElementEditor
          outerVariant={variant === 'hovering' ? variant : outerVariant}
          id={id}
        />
      )
      break
    case 'text':
      children = <RapidTextNodeEditor id={id} />
      break
    default:
      break
  }

  return (
    <motion.div
      className="w-full relative mt-0.5 rounded-tr-md rounded-br-md pr-2.5"
      animate={id === 'root' ? 'initial' : variantToRender}
      initial={{
        background: '#ffffff',
        border: '1px dashed transparent',
        borderLeft: 'none',
      }}
      variants={{
        hovering: {
          background: '#ffcccc',
          border: '1px dashed black',
          borderLeft: 'none',
        },
      }}
    >
      {children}
      {id !== 'root' && (
        <motion.button
          onClick={() => deleteNode(id)}
          onHoverStart={() => setVariant('hovering')}
          onHoverEnd={() => setVariant('initial')}
          className={classNames(
            'absolute -left-5 w-5',
            'border border-black border-dashed border-r-0 rounded-tl-md rounded-bl-md'
          )}
          style={{ top: -1, bottom: -1 }}
          initial={{ background: '#ffffff' }}
          variants={{ hovering: { background: '#ffcccc' } }}
        >
          x
        </motion.button>
      )}
    </motion.div>
  )
}
