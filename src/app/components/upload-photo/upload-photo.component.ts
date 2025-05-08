import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { SharedSettingsService } from '../../services/shared-settings.service'

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss'],
  imports: [
    CommonModule,
  ]
})
export class UploadPhotoComponent {
  uploadedPhoto: string | null = null

  constructor (
    private route: ActivatedRoute, 
    private router: Router,
    private sharedService: SharedSettingsService
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.sharedService.setUploadedPhoto(file)
      this.uploadedPhoto = URL.createObjectURL(file)
    }
  }

  confirmPhoto() {
    const activityId = this.route.snapshot.paramMap.get('activityId')
    if (activityId) {
      this.router.navigate([`/overlay-editor/${activityId}`])
    }
  }
  
  resetPhoto() {
    this.uploadedPhoto = null
    localStorage.removeItem('uploaded_photo')
  }

  toActivities () {
    this.router.navigate(['/activity-list'])
  }
}