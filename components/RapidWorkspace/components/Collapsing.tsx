import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

export function Collapsing({
  children,
  title,
  startOpen = true,
}: {
  startOpen?: boolean
  children: ReactNode
  title: (
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
  ) => ReactNode
}) {
  const [isOpen, setIsOpen] = useState(startOpen)

  return (
    <>
      {title(isOpen, setIsOpen)}
      {isOpen && children}
    </>
  )
}
