export type RapidElementTag =
  | 'video'
  | 'img'
  | 'div'
  | 'button'
  | 'a'
  | 'p'
  | `h${1 | 2 | 3 | 4 | 5 | 6}`

export type RapidElementNode = {
  id: string
  type: 'element'
  data: {
    tag: RapidElementTag
    css: string
    children: (RapidElementNode | RapidTextNode)[]
  }
}

export type RapidTextNode = {
  id: string
  type: 'text'
  data: { text: string }
}
