import { DEFAULT_COMPONENT_TREE } from 'components/RapidWorkspace/constants'
import dynamic from 'next/dynamic'

const Rapid = dynamic(() => import('components/RapidWorkspace'), {
  ssr: false,
})

export default function Home() {
  return <Rapid component={DEFAULT_COMPONENT_TREE} />
}
