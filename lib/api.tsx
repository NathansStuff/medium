import client from './sanity'

export async function getAllPosts() {
  const results = await client.fetch(
    `*[_type =="post"]{
   _id,
   slug {
    current
   }
  } | order(date asc)`
  )
  return results
}

export async function getPostBySlug(slug: string) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
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
  `,
    {
      slug,
    }
  )
  if (!post) {
    return {
      notFound: true,
    }
  }
  return post
}

export async function getAllPostsDetailed() {
 const results = await client.fetch(
  `*[_type == "post"]{
   _id,
   title,
   description,
   mainImage,
   slug,
   author-> {
     name,
     image
   }
 } | order(date asc)`
 )
 return results
}
