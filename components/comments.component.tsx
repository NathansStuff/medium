import { Comment } from '../types/typings'

interface Props {
  comments: Comment[]
}

export default function CommentComponent({ comments }: Props) {
  return (
    <div className="my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500">
      <h3 className="text-4xl">Comments</h3>
      <hr className="pb-2" />
      {comments.length == 0 ? (
        <div>
          <p>No one has commented! Why not be the first?</p>
        </div>
      ) : (
        comments.map((comment) => {
          return (
            <div key={comment._id}>
              <p>
                <span className="text-yellow-500">{comment.name}:</span>{' '}
                {comment.comment}
              </p>
            </div>
          )
        })
      )}
    </div>
  )
}
