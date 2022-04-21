import Link from 'next/link'
import { Post } from '../types/typings'
import { urlFor } from '../helper/helper'

interface Props {
  post: Post
}

function PostCard({ post }: Props) {
  return (
    <Link href={`/post/${post.slug.current}`} key={post._id}>
      <div className="group cursor-pointer overflow-hidden rounded-lg border">
        <img
          className="h-60 w-full transform object-cover transition duration-200 ease-in-out group-hover:scale-105 "
          alt={post.title}
          src={urlFor(post.mainImage).url()!}
        />
        <div className="flex justify-between bg-white p-5">
          <div>
            <p>{post.title}</p>
            <p className="text-xs">
              {post.descripion} by {post.author.name}
            </p>
          </div>
          <img
            className="h-12 w-12 rounded-full"
            alt={post.author.name}
            src={urlFor(post.author.image).url()!}
          />
        </div>
      </div>
    </Link>
  )
}

export default PostCard
