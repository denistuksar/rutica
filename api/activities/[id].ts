// /api/activities/[id].ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id, token } = req.query

  if (!token || !id) {
    return res.status(400).json({ error: 'Access token and activity ID are required' })
  }

  try {
    const response = await axios.get(`https://www.strava.com/api/v3/activities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.status(200).json(response.data)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}