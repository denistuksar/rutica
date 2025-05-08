import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, switchMap } from 'rxjs'
import { ActivityModel } from '../models/activity.model'
import { AuthModel } from '../models/auth.model'

@Injectable({
  providedIn: 'root'
})
export class StravaService {
  constructor(private http: HttpClient) { }

  exchangeToken(code: string): Observable<AuthModel> {
    return this.http.post<AuthModel>('/api/exchange-token', { code }).pipe(
      switchMap(response => {
        localStorage.setItem('strava_auth', JSON.stringify(response))
        return of(response)
      })
    )
  }

  refreshTokenIfNeeded(): Observable<string> {
    const auth = this.getAuthData()
    const now = Math.floor(Date.now() / 1000)

    if (!auth || now < auth.expires_at) {
      return of(auth?.access_token ?? '')
    }

    return this.http.post<AuthModel>('/api/refresh-token', {
      refresh_token: auth.refresh_token
    }).pipe(
      switchMap(response => {
        localStorage.setItem('strava_auth', JSON.stringify(response))
        return of(response.access_token)
      })
    )
  }

  isAuthenticated(): boolean {
    const auth = this.getAuthData()
    return !!auth && Math.floor(Date.now() / 1000) < auth.expires_at
  }

  getActivities(): Observable<ActivityModel[]> {
    return this.refreshTokenIfNeeded().pipe(
      switchMap(token => {
        if (!token) return of([])
        return this.http.get<ActivityModel[]>(`/api/activities?token=${token}`)
      })
    )
  }

  getActivityById(activityId: string): Observable<ActivityModel> {
    return this.refreshTokenIfNeeded().pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available')
        return this.http.get<ActivityModel>(`/api/activities/${activityId}?token=${token}`)
      })
    )
  }

  private getAuthData(): AuthModel | null {
    const raw = localStorage.getItem('strava_auth')
    if (!raw) return null

    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
}