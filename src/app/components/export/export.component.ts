import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas'
import { SharedSettingsService } from '../../services/shared-settings.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-export',
  imports: [
    CommonModule,
    FormsModule
  ],  templateUrl: './export.component.html',
  styleUrl: './export.component.scss'
})
export class ExportComponent {

constructor(
  private sharedSettings: SharedSettingsService,
  private bottomSheetRef: MatBottomSheetRef<ExportComponent>,
  private router: Router
) {}

exportImage(withTransparentBackground = false) {
  this.bottomSheetRef.dismiss()
  this.sharedSettings.setLoading(true)
  const captureArea = document.querySelector('.editor-canvas') as HTMLElement
  const frameWrapper = captureArea.querySelector('.frame-wrapper') as HTMLElement
  const imageElement = captureArea.querySelector('img') as HTMLImageElement

  const originalBackgroundColor = frameWrapper?.style.backgroundColor
  const originalBackgroundImage = frameWrapper?.style.backgroundImage
  const originalImageSrc = imageElement?.src

  // Temporarily remove background and image source if exporting with transparent background
  if (withTransparentBackground && frameWrapper && imageElement) {
    frameWrapper.style.backgroundColor = 'transparent'  // Remove background color
    frameWrapper.style.backgroundImage = 'none'  // Remove background image (if any)
    imageElement.src = ''  // Temporarily remove image src
  }

  const scale = window.devicePixelRatio || 2

  html2canvas(captureArea, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: withTransparentBackground ? null : '#ffffff',
    scale: scale,
    width: captureArea.offsetWidth,
    height: captureArea.offsetHeight
  }).then(originalCanvas => {

    if (frameWrapper) {
      frameWrapper.style.backgroundColor = originalBackgroundColor || ''
      frameWrapper.style.backgroundImage = originalBackgroundImage || ''
    }
    if (imageElement) {
      imageElement.src = originalImageSrc || ''
    }

    const canvas = document.createElement('canvas')
    canvas.width = originalCanvas.width
    canvas.height = originalCanvas.height - 1

    const ctx = canvas.getContext('2d')
    ctx?.drawImage(originalCanvas, 0, 0)

    const imageDataUrl = canvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = imageDataUrl
    link.download = withTransparentBackground ? 'exported-transparent.png' : 'exported-photo.png'
    link.click()
    setTimeout(() => {
      this.sharedSettings.setLoading(false)
    }, 1000);
  })
}

  returnToActivities() {
    this.sharedSettings.resetAll()
    this.bottomSheetRef.dismiss()
    this.router.navigate(['/activity-list'])
  }
}
