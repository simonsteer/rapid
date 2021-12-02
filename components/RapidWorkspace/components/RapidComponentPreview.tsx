import React, { Fragment, useMemo } from 'react'
import { RapidElementNode } from 'components/RapidWorkspace/types'
import { useRapidComponent } from './context'

function useComponentCss(node: RapidElementNode) {
  const css = getElementCss(node)
  return useMemo(() => css, [css])
}

export function RapidComponentPreview() {
  const component = useRapidComponent()
  const css = useComponentCss(component)
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

  const props: { [key: string]: any } = {
    className: css.trim().length ? `rapid-${id}` : undefined,
  }
  if (tag !== 'img') {
    props.children = children.map(child => {
      switch (child.type) {
        case 'element':
          return <RapidElementNodePreview component={child} key={child.id} />
        case 'text':
          return <Fragment key={child.id}>{child.data.text}</Fragment>
        default:
          return null
      }
    })
  }

  return React.createElement(tag, props)
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
