import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/header.components'
import Spanner from '../components/spanner.components'
import { sanityClient } from '../sanity'
import { Post } from '../types/typings';

interface Props {
  posts: Post[]
}

export default function Home({posts}: Props) {
  console.log(posts)
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

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    description,
    mainImage,
    slug,
    author-> {
      name,
      image
    }
  }`
  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
