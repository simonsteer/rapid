import { Dispatch, SetStateAction } from 'react'

export function RapidComponentPropertyLabel({
  inputId,
  isOpen,
  setIsOpen,
  title,
}: {
  inputId?: string
  title: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <label htmlFor={inputId} className="flex justify-between">
      <button className="flex items-center" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <img
          className="ml-2 mt-0.5"
          src={`/icons/chevron-${isOpen ? 'up' : 'down'}.svg`}
          width={8}
        />
      </button>
      <button className="opacity-10 hover:opacity-40 transition-opacity">
        <img src="/icons/info.svg" width={15} />
      </button>
    </label>
  )
}
