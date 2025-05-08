// /api/activities/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { token } = req.query

    if (!token) {
        return res.status(400).json({ error: 'Access token is required' })
    }

    try {
        const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
            headers: { Authorization: `Bearer ${token}` },
            params: { per_page: 20, page: 1 },
        })

        return res.status(200).json(response.data)
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}