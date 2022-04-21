import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import Header from '../../components/header.components'
import { createdSanityClient } from '../../sanity'
import { Post } from '../../types/typings'
import ArticleBody from '../../components/article-body.component'
import CommentComponent from '../../components/comments.component'
import CommentForm from '../../components/comment-form.component'

interface Props {
  post: Post
}

function PostPage({ post }: Props) {
  return (
    <div>
      <Header />
      <ArticleBody post={post} />
      <CommentForm id={post._id} />
      <CommentComponent comments={post.comments} />
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
  const posts = await createdSanityClient.fetch(query)

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
  'comments': *[
  _type == "comment" &&
  post._ref == ^._id &&
  approved == true],
  description,
  mainImage,
  slug,
  body
 }
 `
  const post = await createdSanityClient.fetch(query, {
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
