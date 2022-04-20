import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/header.components'
import { sanityClient } from '../../sanity'
import { Post } from '../../types/typings'

interface Props {
  post: Post
}

function PostPage({ post }: Props) {
  console.log(post)
  return (
    <div>
      <Header />
    </div>
  )
}

export default PostPage

export const getStaticPaths = async () => {
  const query = `*[_type =="post"]{
  _id,
  slug {
   current
  }
 }`
  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  createdAt,
  title,
  author-> {
   name,
   image
  },
  'comment': *[
  _type == "comment" &&
  post._ref == ^._id &&
  approved == true],
  description,
  mainImage,
  slug,
  body
 }
 `
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, //after 60 seconds, update old cached version
  }
}
