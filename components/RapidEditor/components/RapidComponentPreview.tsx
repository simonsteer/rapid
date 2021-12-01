import React, {
  ReactComponentElement,
  ReactNode,
  useMemo,
  useState,
} from 'react'
import { RapidElementNode, RapidElementTag, RapidTextNode } from '../types'

export function RapidComponentPreview({
  component,
}: {
  component: RapidElementNode
}) {
  const css = useMemo(() => getElementCss(component), [component])
  const preview = <RapidElementNodePreview component={component} />

  return (
    <>
      {preview}
      <style jsx global>
        {css}
      </style>
    </>
  )
}

function RapidElementNodePreview({
  component,
}: {
  component: RapidElementNode
}) {
  const {
    data: { tag, children, css },
    id,
  } = component

  return React.createElement(tag, {
    className: css.trim().length ? `rapid-${id}` : undefined,
    children: children.map(child => {
      switch (child.type) {
        case 'element':
          return <RapidElementNodePreview component={child} />
        case 'text':
          return child.data.text
        default:
          return null
      }
    }),
  })
}

function getElementCss(root: RapidElementNode): string {
  return root.data.children.reduce((css, child) => {
    switch (child.type) {
      case 'element':
        return css + `\n` + getElementCss(child)
      case 'text':
        return css
      default:
        return css
    }
  }, root.data.css.replace(/\$/g, `.rapid-${root.id}`))
}
