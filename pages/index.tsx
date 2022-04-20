import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/header.components'
import Spanner from '../components/spanner.components'

const Home: NextPage = () => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Spanner />
    </div>
  )
}

export default Home
