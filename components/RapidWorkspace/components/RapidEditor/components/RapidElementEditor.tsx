import { useState } from 'react'
import classNames from 'classnames'
import { RapidElementNode } from '../../../types'
import { Separator } from '../Separator'
import { Collapsing, FreeText, RapidComponentChildOptions } from '.'
import { RapidComponentPropertyLabel } from './RapidComponentPropertyLabel'
import { RapidEditor } from '../RapidEditor'

export function RapidElementEditor({
  component,
  root,
}: {
  component: RapidElementNode
  root?: boolean
}) {
  const [open, setOpen] = useState(false)
  const cssInputId = `${component.id}-css`

  const { children, css, tag } = component.data

  return (
    <div className={classNames('w-full', root ? 'my-0.5' : 'mt-1.5')}>
      <div className={classNames('max-w-max relative', !root && '-ml-6')}>
        <button
          className={classNames(
            'px-2 py-0.5 bg-white transition-colors hover:bg-gray-100 border border-gray-300 rounded-md',
            open ? 'bg-gray-100' : 'bg-white',
            root ? 'ml-0.5' : 'ml-6'
          )}
          onClick={() => setOpen(!open)}
        >
          {`<${tag}>`}
        </button>
        {root && (
          <span className="absolute left-full top-0 text-xs pl-2 text-blue-500">
            root
          </span>
        )}
      </div>
      {open && (
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
                value={css}
                setValue={console.log}
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
              {children.map(child => (
                <RapidEditor component={child} key={child.id} />
              ))}
              <RapidComponentChildOptions
                component={component}
                onClickTag={console.log}
              />
            </Collapsing>
          </div>
        </div>
      )}
    </div>
  )
}
