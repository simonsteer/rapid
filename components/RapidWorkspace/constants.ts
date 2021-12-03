import { v4 as uuid } from 'uuid'
import { RapidElementNode } from './types'
import { createTagMap, ALL_TAGS } from './utils'

export const DEFAULT_CSS = `$ {
  background: #efefef;
  width: 200px;
  height: 200px;
  border-radius: 15px;
  border: 1px solid #000;
}

$ > p {
  color: #a3a3a3;
  font-size: 24px;
  line-height: 1.15;
}`

export const VALID_TAG_DESCENDANTS = createTagMap(tag => {
  switch (tag) {
    case 'a':
      return ALL_TAGS.filter(t => t !== 'a' && t !== 'button')
    case 'button':
      return ALL_TAGS.filter(t => t !== 'a' && t !== 'button')
    case 'p':
      return ALL_TAGS.filter(t => t !== 'p' && t !== 'div')
    case 'img':
    case 'video':
      return []
    default:
      return ALL_TAGS
  }
})

export const REQUIRED_TAG_ATTRS = createTagMap(tag => {
  switch (tag) {
    default:
      return []
  }
})

export const DEFAULT_COMPONENT_TREE: RapidElementNode = {
  id: uuid(),
  type: 'element',
  data: {
    tag: 'div',
    css: DEFAULT_CSS,
    attrs: {},
    children: [
      {
        id: uuid(),
        type: 'element',
        data: {
          attrs: {},
          tag: 'p',
          css: '',
          children: [
            { id: uuid(), type: 'text', data: { text: 'Hello world!' } },
          ],
        },
      },
    ],
  },
}
