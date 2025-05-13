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
  ], templateUrl: './export.component.html',
  styleUrl: './export.component.scss'
})
export class ExportComponent {

  constructor(
    private sharedSettings: SharedSettingsService,
    private bottomSheetRef: MatBottomSheetRef<ExportComponent>,
    private router: Router
  ) { }

  exportImage(withTransparentBackground = false) {
    this.bottomSheetRef.dismiss();

    const captureArea = document.querySelector('.editor-canvas') as HTMLElement;
    const imageElement = captureArea.querySelector('img') as HTMLImageElement;
    const frameWrapper = captureArea.querySelector('.frame-wrapper') as HTMLElement;

    if (withTransparentBackground) {
      frameWrapper.style.backgroundColor = 'transparent'
      frameWrapper.style.backgroundImage = 'none'
      imageElement.style.display = 'none'
    }

    // 1. Load the original image at full quality
    const originalImage = new Image();
    originalImage.crossOrigin = 'anonymous';
    originalImage.src = imageElement.src;

    originalImage.onload = () => {
      this.sharedSettings.setLoading(true);
      // 2. Hide image visually but keep its space for overlays
      const originalFilter = imageElement.style.filter;
      imageElement.style.filter = 'opacity(0%)';

      html2canvas(captureArea, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        scale: 5
      }).then(overlayCanvas => {
        // 3. Restore image
        imageElement.style.filter = originalFilter;

        // 4. Create final canvas at full image resolution
        const finalCanvas = document.createElement('canvas');
        const newSize = this.fitTo9by16(originalImage.naturalWidth, originalImage.naturalHeight)

        finalCanvas.width = newSize.width
        finalCanvas.height = newSize.height;
        const ctx = finalCanvas.getContext('2d')!;

        // 5. Draw the original image
        if (!withTransparentBackground) {
          ctx.drawImage(originalImage, 0, 0)
        }

        // 6. Draw the overlays, scaling up to match the original image size
        ctx.drawImage(
          overlayCanvas,
          0, 0, overlayCanvas.width, overlayCanvas.height,
          0, 0, finalCanvas.width, finalCanvas.height
        );

        // 7. Export
        finalCanvas.toBlob(blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'exported-photo.png';
          link.click();
          URL.revokeObjectURL(url);
        }, 'image/png');

        setTimeout(() => {
          this.sharedSettings.setLoading(false);
        }, 1000);
      });
    };
  }

  fitTo9by16 (width: number, height: number) {
    const targetRatio = 9 / 16
    const currentRatio = width / height

    if (currentRatio > targetRatio) {
      return {
        width: height * targetRatio,
        height
      }
    } else {
      return {
        width,
        height: width / targetRatio
      }
    }
  }

  returnToActivities() {
    this.sharedSettings.resetAll()
    this.bottomSheetRef.dismiss()
    this.router.navigate(['/activity-list'])
  }
}
