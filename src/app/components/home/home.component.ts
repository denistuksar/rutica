import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StravaService } from '../../services/strava.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { InstallDialogComponent } from '../install-dialog/install-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private deferredPrompt: any;
  private promptListener!: () => void;

  constructor(
    private stravaService: StravaService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private dialog: MatDialog
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

    if (!this.isAppInstalled()) {
      this.setupPwaInstallPrompt()
      const promptEl = document.getElementById('install-prompt')
      if (this.isIOS() && promptEl) {
        promptEl.style.display = 'block'
      }
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

  ngOnDestroy() {
    if (this.promptListener) {
      this.promptListener()
    }
  }

  isAppInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || !environment.production;
  }

  private setupPwaInstallPrompt() {
    this.promptListener = this.renderer.listen('window', 'beforeinstallprompt', (e: any) => {
      e.preventDefault()
      this.deferredPrompt = e

      const installBtn = document.getElementById('install-prompt')
      if (installBtn) {
        installBtn.style.display = 'block'

        installBtn.addEventListener('click', async () => {
          installBtn.style.display = 'none'
          this.deferredPrompt.prompt()
          const choice = await this.deferredPrompt.userChoice
          console.log('Install outcome:', choice.outcome)
          this.deferredPrompt = null
        })
      }
    })
  }

  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  }

  showInstallationInstructions() {
    this.dialog.open(InstallDialogComponent);
  }
}
