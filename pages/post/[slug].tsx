import { GetStaticProps } from 'next'
import Header from '../../components/header.components'
import { Post } from '../../types/typings'
import ArticleBody from '../../components/article-body.component'
import CommentComponent from '../../components/comments.component'
import CommentForm from '../../components/comment-form.component'
import { getAllPosts, getPostBySlug } from '../../lib/api';

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
  const posts = await getAllPosts()

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
  const slug: string = (params?.slug as string) || 'test'
  const post = await getPostBySlug(slug)

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
