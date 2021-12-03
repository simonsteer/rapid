import React, { Fragment, useEffect } from 'react'
import { RapidElementNode } from 'components/RapidWorkspace/types'
import { useRapidComponent } from './context'

export function RapidComponentPreview() {
  const component = useRapidComponent()
  useGlobalStyle(component.id, getElementCss(component))

  return <RapidElementNodePreview component={component} />
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

// injects style tag into the <head> of the current document and replaces the css when it changes
function useGlobalStyle(nodeId: string, css: string) {
  const styleTagId = `rapid-style-${nodeId}`

  useEffect(() => {
    const style = document.createElement('style')
    style.setAttribute('id', styleTagId)
    style.append(css)
    document.head.append(style)

    return () => document.querySelector(`style#${styleTagId}`)?.remove()
  }, [nodeId, css])
}

// concats root node and all subnode css templates into a single string
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
