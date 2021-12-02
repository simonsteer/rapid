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
    attrs: { [key: string]: any }
  }
}

export type RapidTextNode = {
  id: string
  type: 'text'
  data: { text: string }
}

export type RapidNode = RapidElementNode | RapidTextNode

export type NormalizedElementNode = {
  [K in keyof RapidElementNode]: K extends 'data'
    ? {
        [P in keyof RapidElementNode['data']]: P extends 'children'
          ? string[]
          : RapidElementNode['data'][P]
      }
    : RapidElementNode[K]
} & { parent: string | null }

export type NormalizedNode =
  | (RapidTextNode & {
      parent: string | null
    })
  | NormalizedElementNode
