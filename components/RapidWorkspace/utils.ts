import { RapidElementTag } from './types'

export const ALL_TAGS: RapidElementTag[] = [
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

export function createTagMap<MapFn extends (tag: RapidElementTag) => any>(
  mapFn: MapFn
) {
  return ALL_TAGS.reduce(
    (acc, tag) => ({ ...acc, [tag]: mapFn(tag) }),
    {} as { [Tag in RapidElementTag]: ReturnType<MapFn> }
  )
}
