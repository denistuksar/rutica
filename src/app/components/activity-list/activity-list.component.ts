import { Component, OnInit } from '@angular/core'
import { StravaService } from '../../services/strava.service'
import { CommonModule } from '@angular/common'
import { ActivityModel } from '../../models/activity.model'
import { Router } from '@angular/router'
import { MapComponent } from '../map/map.component'
import { ActivityStatsComponent } from '../activity-stats/activity-stats.component'

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    ActivityStatsComponent
  ],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.scss'
})
export class ActivityListComponent implements OnInit {
  activities: ActivityModel[] = []
  loading = false

  constructor(
    private stravaService: StravaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkAuthorization()
  }

  checkAuthorization() {
    const isAuthorized = this.stravaService.isAuthenticated()

    if (!isAuthorized) {
      console.log('no auth')
      this.router.navigate(['/'])
    } else {
      this.fetchActivities()
    }
  }

  fetchActivities() {
    this.updateThemeColor('#1d1f1f')
    this.loading = true
    this.stravaService.getActivities().subscribe({
      next: data => {
        const validTypes = ['Run', 'Ride', 'Mountain Bike', 'Hike', 'Walk', 'Roller Ski', 'Nordic Ski']
        this.loading = false
        const filtered = data.filter(activity =>
          validTypes.includes(activity.type) && activity.map && activity.map.summary_polyline
        )
        this.activities = filtered
      },
      error: err => {
        console.error(err)
        this.loading = false
      }
    })
  }

  updateThemeColor(color: string) {
    const theme = document.querySelector('meta[name="theme-color"]')
    if (theme) {
      theme.setAttribute('content', color)
    }
  }

  goToUpload(activityId: number) {
    this.router.navigate([`/upload/${activityId}`])
  }
}