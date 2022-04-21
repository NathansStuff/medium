import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/header.components'
import { createdSanityClient } from '../../sanity'
import { Post } from '../../types/typings'
import { useForm, SubmitHandler } from 'react-hook-form'
import ArticleBody from '../../components/article-body.component'

interface Props {
  post: Post
}

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

function PostPage({ post }: Props) {
  const { register, handleSubmit } = useForm()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log('submmiting')
    console.log(data)
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log('submitted succ')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div>
      <Header />
      <ArticleBody post={post} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
      >
        <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
        <h4 className="tet-3xl font-bold">Leave a comment below!</h4>
        <hr className="mt-2 py-3" />
        <input name="_id" ref={register()} type="hidden" value={post._id} />
        <label className="mb-5 block">
          <span className="text-gray-700">Name</span>
          <input
            name="name"
            ref={register({ required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            placeholder="Name"
            type="text"
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Email</span>
          <input
            name="email"
            ref={register({ required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            placeholder="Email"
            type="email"
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Comment</span>
          <textarea
            name="comment"
            ref={register({ required: true })}
            className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            placeholder="Name"
            rows={8}
          />
        </label>
        <input
          type="submit"
          className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
        />
      </form>
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
