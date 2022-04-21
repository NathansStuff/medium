import type { NextApiRequest, NextApiResponse } from 'next'
import client from '../../lib/sanity'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {_id, name, email, comment } = JSON.parse(req.body)

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email,
      comment
    })
  } catch(error) {
  return res.status(500).json({message: "Couldn't submit comment", error})
  }
  res.status(200).json({message: 'Comment submitted'})
}