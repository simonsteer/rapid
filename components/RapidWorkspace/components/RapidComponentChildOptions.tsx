import classNames from 'classnames'
import { List } from 'components'
import { useRapidEditor, useRapidTreeNode } from './context'
import { VALID_TAG_DESCENDANTS } from '../constants'
import { NormalizedElementNode, RapidElementTag } from '../types'
import { Collapsing } from './Collapsing'

export function RapidComponentChildOptions({ id }: { id: string }) {
  const { insertNode } = useRapidEditor()
  const component = useRapidTreeNode(id) as NormalizedElementNode
  const tags = VALID_TAG_DESCENDANTS[component.data.tag]

  return (
    <div className="flex mt-2.5">
      <Collapsing
        startOpen={false}
        title={(isOpen, setIsOpen) => (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={classNames(
              'px-2 py-0.5 self-start rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors',
              isOpen && 'bg-gray-100'
            )}
          >
            {isOpen ? '-' : '+'}
          </button>
        )}
      >
        <List
          className="flex flex-wrap -mt-2.5"
          data={[...tags, 'text' as const]}
          itemProps={{ className: 'ml-2.5 mt-2.5' }}
          renderItem={tag => (
            <button
              onClick={() => insertNode(id, tag)}
              className="px-2 py-0.5 transition-colors border border-gray-300 bg-white hover:bg-gray-100 rounded-md"
            >
              {tag}
            </button>
          )}
        />
      </Collapsing>
    </div>
  )
}
