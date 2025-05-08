import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StravaService } from '../../services/strava.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private stravaService: StravaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  connectToStrava() {
    const clientId = environment.stravaClientId
    const redirectUri = encodeURIComponent(window.location.origin)
    const scope = 'activity:read_all'

    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`
  }


  ngOnInit() {
    // If already authenticated, go to activity list
    if (this.stravaService.isAuthenticated()) {
      this.router.navigate(['/activity-list'])
      return
    }

    // Otherwise, check for auth code from Strava redirect
    this.route.queryParams.subscribe(params => {
      const code = params['code']
      if (code) {
        this.stravaService.exchangeToken(code).subscribe({
          next: () => {
            this.router.navigate(['/activity-list'])
          },
          error: (error) => {
            console.error('Error exchanging token:', error)
          }
        })
      }
    })
  }
}
