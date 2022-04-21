import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/header.components'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../types/typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

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
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div>
      <Header />
      <img
        src={urlFor(post.mainImage).url()!}
        alt={post.title}
        className="h-40 w-full object-cover"
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.descripion}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            alt={post.author.name}
            className="h-10 w-10 rounded-full"
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => {
                ;<h1 className="my-5 text-2xl font-bold" {...props} />
              },
              h2: (props: any) => {
                ;<h2 className="my-5 text-xl font-bold" {...props} />
              },
              li: ({ children }: any) => {
                ;<li className="ml-4 list-disc">{children}</li>
              },
              link: ({ href, children }: any) => {
                ;<a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              },
            }}
          />
        </div>
      </article>
      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mb-10 flex max-w-2xl flex-col p-5"
      >
        <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
        <h4 className="tet-3xl font-bold">Leave a comment below!</h4>
        <hr className="mt-2 py-3" />
        <input {...register('_id')} type="hidden" name="_id" value={post._id} />
        <label className="mb-5 block">
          <span className="text-gray-700">Name</span>
          <input
            {...(register('name'), { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            placeholder="Name"
            type="text"
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Email</span>
          <input
            {...(register('email'), { required: true })}
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            placeholder="Email"
            type="email"
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Comment</span>
          <textarea
            {...(register('comment'), { required: true })}
            className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            placeholder="Name"
            rows={8}
          />
        </label>
        {/* Errors will return when field validation fails */}

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
