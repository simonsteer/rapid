import { CSSProperties } from 'react'
import classNames from 'classnames'

export function FrameTitleButton({
  children,
  onClick,
  style,
  className,
}: {
  children: string
  onClick(): void
  style?: CSSProperties
  className?: string
}) {
  return (
    <button
      className={classNames(
        'w-5 h-5 flex items-center justify-center ml-1.5 transition-colors bg-white hover:bg-gray-200 focus:border focus:border-gray-200 focus:border-dotted rounded-sm',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
