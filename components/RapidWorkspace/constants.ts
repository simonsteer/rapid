import { v4 as uuid } from 'uuid'
import { RapidElementNode, RapidElementTag } from './types'

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

const ALL_TAGS: RapidElementTag[] = [
  'a',
  'button',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'img',
  'p',
  'video',
]

export const VALID_TAG_DESCENDANTS: {
  [Tag in RapidElementTag]: RapidElementTag[]
} = {
  a: ALL_TAGS.filter(t => t !== 'a' && t !== 'button'),
  button: ALL_TAGS.filter(t => t !== 'a' && t !== 'button'),
  p: ALL_TAGS.filter(t => t !== 'p'),
  div: ALL_TAGS,
  h1: ALL_TAGS,
  h2: ALL_TAGS,
  h3: ALL_TAGS,
  h4: ALL_TAGS,
  h5: ALL_TAGS,
  h6: ALL_TAGS,
  img: [],
  video: [],
}

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
