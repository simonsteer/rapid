import dynamic from 'next/dynamic'

const RapidWorkspace = dynamic(() => import('components/RapidWorkspace'), {
  ssr: false,
})

export default function Home() {
  return <RapidWorkspace />
}
