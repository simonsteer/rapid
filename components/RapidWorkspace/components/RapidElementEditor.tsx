import classNames from 'classnames'
import { NormalizedElementNode } from '../types'
import { Separator } from './Separator'
import { Collapsing } from './Collapsing'
import { FreeText } from './FreeText'
import { RapidComponentChildOptions } from './RapidComponentChildOptions'
import { RapidComponentPropertyLabel } from './RapidComponentPropertyLabel'
import { RapidEditor, EditorVariant } from './RapidEditor'
import { useRapidTreeNode, useUpdateRapidNode } from './context'

export function RapidElementEditor({
  id,
  outerVariant,
}: {
  id: string
  outerVariant?: EditorVariant
}) {
  const root = id === 'root'
  const component = useRapidTreeNode(id) as NormalizedElementNode
  const update = useUpdateRapidNode()

  const cssInputId = `${component.id}-css`

  return (
    <div className={classNames('w-full', root ? 'my-0.5' : 'my-1.5')}>
      <Collapsing
        title={(isOpen, setIsOpen) => (
          <div className={classNames('max-w-max relative', !root && '-ml-6')}>
            <button
              className={classNames(
                'px-2 py-0.5 bg-white transition-colors hover:bg-gray-100 border border-gray-300 rounded-md',
                isOpen ? 'bg-gray-100' : 'bg-white',
                root ? 'ml-0.5' : 'ml-6'
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {`<${component.data.tag}>`}
            </button>
            {root && (
              <span className="absolute left-full top-0 text-xs pl-2 text-blue-500">
                root
              </span>
            )}
          </div>
        )}
      >
        <div className="pl-3.5 mt-2 flex">
          <Separator className="mr-2.5" />
          <div className="flex flex-col w-full">
            <Collapsing
              title={(isOpen, setIsOpen) => (
                <RapidComponentPropertyLabel
                  inputId={cssInputId}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  title="css"
                />
              )}
            >
              <FreeText
                name={cssInputId}
                value={component.data.css}
                setValue={css => update(id, { data: { css } })}
                placeholder="write css rules for this element here"
                className="border-l my-1"
              />
            </Collapsing>
            <Collapsing
              title={(isOpen, setIsOpen) => (
                <RapidComponentPropertyLabel
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  title="children"
                />
              )}
            >
              {component.data.children.map(childId => (
                <RapidEditor
                  outerVariant={outerVariant}
                  id={childId}
                  key={childId}
                />
              ))}
              <RapidComponentChildOptions id={id} />
            </Collapsing>
          </div>
        </div>
      </Collapsing>
    </div>
  )
}
