import { DEFAULT_COMPONENT_TREE } from 'components/RapidWorkspace/constants'
import dynamic from 'next/dynamic'

const RapidWorkspace = dynamic(() => import('components/RapidWorkspace'), {
  ssr: false,
})

export default function Home() {
  return <RapidWorkspace component={DEFAULT_COMPONENT_TREE} />
}
