import classNames from 'classnames'

export function Separator({ className }: { className?: string }) {
  return (
    <span
      className={classNames('border-l border-dashed border-black', className)}
    />
  )
}
