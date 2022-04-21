import Head from 'next/head'
import Header from '../components/header.components'
import PostCard from '../components/post-card.component'
import Spanner from '../components/spanner.components'
import { createdSanityClient } from '../sanity'
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
  const posts = await createdSanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
