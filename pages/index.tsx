import Head from 'next/head'
import Header from '../components/header.components'
import PostCard from '../components/post-card.component'
import Spanner from '../components/spanner.components'
import { getAllPostsDetailed } from '../lib/api';
import { Post } from '../types/typings'

interface Props {
  posts: Post[]
}

export default function Home({ posts }: Props) {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Spanner />
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => {
          return <PostCard key={post._id} post={post} />
        })}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
   const posts = await getAllPostsDetailed()

  return {
    props: {
      posts,
    },
  }
}
