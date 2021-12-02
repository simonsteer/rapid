import TextareaAutosize from 'react-textarea-autosize'
import { CSSProperties, Dispatch, SetStateAction } from 'react'
import classNames from 'classnames'

export function FreeText({
  value,
  setValue,
  name,
  placeholder,
  className,
  style,
}: {
  value: string
  setValue: (val: string) => void
  name: string
  placeholder?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <TextareaAutosize
      name={name}
      value={value}
      onChange={e => setValue(e.target.value)}
      style={{ resize: 'none', ...style }}
      className={classNames(
        'w-full text-sm outline-none no-scrollbar',
        'transition-colors text-gray-500 focus:text-black',
        'border rounded-md',
        'border-gray-300 border-dashed bg-white focus:border-black px-3 py-1',
        className
      )}
      placeholder={placeholder}
    />
  )
}
