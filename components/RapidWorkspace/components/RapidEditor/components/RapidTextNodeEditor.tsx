import { Dispatch, SetStateAction, useRef } from 'react'
import classNames from 'classnames'
import { RapidTextNode } from '../../../types'
import { FreeText, Collapsing } from '.'

export function RapidTextNodeEditor({
  component,
  text,
  setText,
}: {
  component: RapidTextNode
  text: string
  setText: Dispatch<SetStateAction<string>>
}) {
  const inputId = `${component.id}-text`

  return (
    <div className="w-full flex items-start mt-2.5">
      <Collapsing
        title={(isOpen, setIsOpen) => (
          <button
            className={classNames(
              'mb-0.5 px-2 py-0.5 bg-white transition-colors hover:bg-gray-100 border border-gray-300 rounded-md',
              isOpen ? 'bg-gray-100' : 'bg-white'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            text
          </button>
        )}
      >
        <div className="ml-2.5 flex-1">
          <FreeText
            name={inputId}
            value={text}
            setValue={setText}
            placeholder="write something!"
            className="mb-0"
          />
        </div>
      </Collapsing>
    </div>
  )
}
