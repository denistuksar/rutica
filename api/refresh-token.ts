import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { refresh_token } = req.body

    const STRAVA_CLIENT_ID = process.env['STRAVA_CLIENT_ID']
    const STRAVA_CLIENT_SECRET = process.env['STRAVA_CLIENT_SECRET']

    if (!refresh_token) {
        return res.status(400).json({ error: 'Refresh token is required' })
    }

    try {
        const response = await axios.post('https://www.strava.com/oauth/token', {
            client_id: STRAVA_CLIENT_ID,
            client_secret: STRAVA_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token,
        })

        return res.status(200).json(response.data)
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}