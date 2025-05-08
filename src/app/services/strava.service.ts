import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, switchMap } from 'rxjs'
import { environment } from '../../environments/environment'
import { ActivityModel } from '../models/activity.model'
import { AuthModel } from '../models/auth.model'


@Injectable({
  providedIn: 'root'
})
export class StravaService {
  private readonly apiUrl = 'https://www.strava.com/api/v3'
  private tokenUrl = 'https://www.strava.com/oauth/token'
  private clientId = environment.strava.clientId
  private clientSecret = environment.strava.clientSecret
  constructor(private http: HttpClient) {}

  exchangeToken(code: string): Observable<AuthModel> {
    return this.http.post<AuthModel>(this.tokenUrl, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code'
    }).pipe(
      switchMap(response => {
        localStorage.setItem('strava_auth', JSON.stringify(response))
        return of(response)
      })
    )
  }

  refreshTokenIfNeeded(): Observable<string> {
    const authData = localStorage.getItem('strava_auth')
    if (!authData) return of('')
  
    const auth = JSON.parse(authData)
    const now = Math.floor(Date.now() / 1000)
  
    if (now < auth.expires_at) {
      return of(auth.access_token)
    }
  
    return this.http.post<AuthModel>(this.tokenUrl, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: auth.refresh_token
    }).pipe(
      switchMap(response => {
        localStorage.setItem('strava_auth', JSON.stringify(response))
        return of(response.access_token)
      })
    )
  }

  isAuthenticated(): boolean {
    const authData = localStorage.getItem('strava_auth')
    if (!authData) return false
    const auth = JSON.parse(authData)
    return Math.floor(Date.now() / 1000) < auth.expires_at
  }

  getActivities(): Observable<ActivityModel[]> {
    return this.refreshTokenIfNeeded().pipe(
      switchMap(token => {
        if (!token) return of([])
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        const params = { per_page: 100, page: 1 }
        return this.http.get<ActivityModel[]>(`${this.apiUrl}/athlete/activities`, { headers, params })
      })
    )
  }

  getActivityById(activityId: string): Observable<ActivityModel> {
    return this.refreshTokenIfNeeded().pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available')
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
        return this.http.get<ActivityModel>(`${this.apiUrl}/activities/${activityId}`, { headers })
      })
    )
  }
}