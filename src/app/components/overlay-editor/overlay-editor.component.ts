import { Component, effect, ElementRef, OnInit, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { StravaService } from '../../services/strava.service';
import { ActivityModel } from '../../models/activity.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';
import { ActivityStatsComponent } from '../activity-stats/activity-stats.component';
import { FormsModule } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { RouteSettingsComponent } from '../route-settings/route-settings.component';
import { SharedSettingsService } from '../../services/shared-settings.service';
import { ImageSettingsComponent } from '../image-settings/image-settings.component';
import { ExportComponent } from '../export/export.component';
import { StatsSettingsComponent } from '../stats-settings/stats-settings.component';
import { TemplatesComponent } from '../templates/templates.component';

@Component({
  selector: 'app-overlay-editor',
  imports: [
    CommonModule,
    FormsModule,
    MapComponent,
    ActivityStatsComponent,
    MatBottomSheetModule
  ],
  templateUrl: './overlay-editor.component.html',
  styleUrl: './overlay-editor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OverlayEditorComponent implements OnInit {
  @ViewChild('imageWrapper', { static: false }) imageWrapperRef!: ElementRef<HTMLDivElement>
  @ViewChild('frameWrapper') frameWrapper!: ElementRef;
  @ViewChild('imageElement') imageElement!: ElementRef;
  @ViewChild('routeElement') routeElement!: ElementRef;
  @ViewChild('statsElement') statsElement!: ElementRef;
  translateX: number = 0
  width = 0
  height = 0
  activity: ActivityModel | undefined
  loading = false
  photoUrl: string | null = null
  mapPosition = { x: 50, y: 50 }
  statsPosition = { x: 100, y: 300 }
  imagePositionX = 0;
  imagePositionY = 0;

  dragging = false
  dragTarget: 'image' | 'map' | 'stats' | null = null;
  startX = 0
  startY = 0
  mapScale = 1
  statsScale = 1
  initialDistance = 0
  initialScale = 1
  resizing = false
  mapColor: WritableSignal<string> = signal('fff')
  statsColor: WritableSignal<string> = signal('fff')
  bgColor: WritableSignal<string> = signal('fff')
  displayMap: WritableSignal<boolean> = signal(true)
  verticalLines: number[] = []
  horizontalLines: number[] = []
  horizontalAlign = false
  verticalAlign = false
  scale = 1
  offsetX = 0
  offsetY = 0

  constructor (
    private stravaService: StravaService,
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private settings: SharedSettingsService,
    private router: Router
  ) {}

  generateGridLines() {
    const rect = this.imageWrapperRef.nativeElement.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height

    const spacingPx = 10
    const verticalCount = Math.floor(this.width / spacingPx)
    const horizontalCount = Math.floor(this.height / spacingPx)
  
    this.verticalLines = Array.from({ length: verticalCount }, (_, i) =>
      ((i + 1) * spacingPx / this.width) * 100
    )
  
    this.horizontalLines = Array.from({ length: horizontalCount }, (_, i) =>
      ((i + 1) * spacingPx / this.height) * 100
    )
  }

  private gridEffect = effect(() => {
    if (this.settings.gridLines()) {
      this.generateGridLines()
    } else {
      this.verticalLines = []
      this.horizontalLines = []
    }
  })

  private horizontalImageAlignEffect = effect(() => {
    if (this.settings.horizontalImageAlign()) {
      this.alignImage('horizontal')
    }
  })

  private verticalImageAlignEffect = effect(() => {
    if (this.settings.verticalImageAlign()) {
      this.alignImage('vertical')
    }
  })

  private horizontalRouteAlignEffect = effect(() => {
    if (this.settings.horizontalRouteAlign()) {
      this.alignRoute('horizontal')
    }
  })

  private verticalRouteAlignEffect = effect(() => {
    if (this.settings.verticalRouteAlign()) {
      this.alignRoute('vertical');
    }
  })

  private horizontalStatsAlignEffect = effect(() => {
    if (this.settings.horizontalStatsAlign()) {
      this.alignStats('horizontal')
    }
  })

  private verticalStatsAlignEffect = effect(() => {
    if (this.settings.verticalStatsAlign()) {
      this.alignStats('vertical');
    }
  })

  private loadingEffect = effect(() => {
    if (this.settings.loading()) {
      this.loading = true
    } else {
      this.loading = false
    }
  })

  ngOnInit(): void {
    this.settings.setLoading(true)
    const activityId = this.route.snapshot.paramMap.get('activityId')
    if (activityId) {
      this.stravaService.getActivityById(activityId).subscribe({
        next: (data) => {
          this.activity = data
          console.log(this.activity)
          const file = this.settings.uploadedPhoto()
          if (file) {
            this.photoUrl = URL.createObjectURL(file)
          } else {
            this.photoUrl = '/assets/bg.jpg'
            // this.router.navigate(['/activity-list'])
          }
          this.settings.setLoading(false)
        },
        error: (err) => {
          console.error('Error fetching activity:', err)
          this.settings.setLoading(false)
        },
      })
      this.mapColor = this.settings.mapColor
      this.displayMap = this.settings.displayRoute
      this.statsColor = this.settings.statsColor
      this.bgColor = this.settings.bgColor
    }
  }

  alignImage(direction: 'horizontal' | 'vertical') {
    const frameRect = this.frameWrapper.nativeElement.getBoundingClientRect()
    const imageRect = this.imageElement.nativeElement.getBoundingClientRect()
  
    if (direction === 'horizontal') {
      this.offsetX += (frameRect.width / 2 - (imageRect.left + imageRect.width / 2))
    } else if (direction === 'vertical') {
      this.offsetY += (frameRect.height / 2 - (imageRect.top + imageRect.height / 2))
    }
  }

  alignRoute(direction: 'horizontal' | 'vertical') {
    if (!this.routeElement || !this.frameWrapper) return
    const routeEl = this.routeElement.nativeElement
    const frameEl = this.frameWrapper.nativeElement
  
    if (direction === 'horizontal') { 
      const routeWidth = routeEl.offsetWidth
      const frameWidth = frameEl.offsetWidth
      const centerX = (frameWidth - routeWidth) / 2
      this.mapPosition.x = centerX
    } else if (direction === 'vertical') { 
      const routeHeight = routeEl.offsetHeight
      const frameHeight = frameEl.offsetHeight
      const centerY = (frameHeight - routeHeight) / 2
      this.mapPosition.y = centerY
    }
  }

  alignStats(direction: 'horizontal' | 'vertical') {
    if (!this.statsElement || !this.frameWrapper) return
    const statsEl = this.statsElement.nativeElement
    const frameEl = this.frameWrapper.nativeElement
  
    if (direction === 'horizontal') { 
      const statsWidth = statsEl.offsetWidth
      const frameWidth = frameEl.offsetWidth
      const centerX = (frameWidth - statsWidth) / 2
      this.statsPosition.x = centerX
    } else if (direction === 'vertical') { 
      const statsHeight = statsEl.offsetHeight
      const frameHeight = frameEl.offsetHeight
      const centerY = (frameHeight - statsHeight) / 2
      this.statsPosition.y = centerY
    }
  }
  
  getMapStyle() {
    return {
      left: `${this.mapPosition.x}px`,
      top: `${this.mapPosition.y}px`,
      transform: `scale(${this.mapScale})`
    }
  }
  
  getStatsStyle() {
    return {
      left: `${this.statsPosition.x}px`,
      top: `${this.statsPosition.y}px`,
      transform: `scale(${this.statsScale})`
    }
  }

  startDrag(event: MouseEvent | TouchEvent, target: 'map' | 'stats') {
    if (this.dragging) return;
  
    event.preventDefault()
    event.stopPropagation()
  
    this.dragging = true
    this.dragTarget = target
    this.resizing = false
  
    if (event instanceof MouseEvent) {
      this.startX = event.clientX
      this.startY = event.clientY
    } else if (event.touches.length === 1) {
      this.startX = event.touches[0].clientX
      this.startY = event.touches[0].clientY
    }
  
    window.addEventListener('mousemove', this.move)
    window.addEventListener('touchmove', this.move, { passive: false })
    window.addEventListener('mouseup', this.endDrag)
    window.addEventListener('touchend', this.endDrag)
  }

move = (event: MouseEvent | TouchEvent) => {
  if (!this.dragging || !this.dragTarget) return;

  // Prevent drag of other elements
  if (event instanceof TouchEvent) {
      event.stopPropagation();
  }

  let dx = 0;
  let dy = 0;

  if (event instanceof MouseEvent) {
      const currentX = event.clientX;
      const currentY = event.clientY;
      dx = currentX - this.startX;
      dy = currentY - this.startY;
      this.updatePosition(dx, dy);
      this.startX = currentX;
      this.startY = currentY;
  } else if (event.touches.length === 1) {
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      dx = currentX - this.startX;
      dy = currentY - this.startY;
      this.updatePosition(dx, dy);
      this.startX = currentX;
      this.startY = currentY;
  } else if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const newDistance = this.getDistance(touch1, touch2);

      if (!this.resizing) {
          this.initialDistance = newDistance;
          this.initialScale = this.dragTarget === 'map' ? this.mapScale : this.statsScale;
          this.resizing = true;
          return;
      }

      const scaleFactor = newDistance / this.initialDistance;
      if (this.dragTarget === 'map') {
          this.mapScale = this.initialScale * scaleFactor;
      } else if (this.dragTarget === 'stats') {
          this.statsScale = this.initialScale * scaleFactor;
      }
  }
  }

  updatePosition(dx: number, dy: number) {
    if (this.dragTarget === 'map') {
      this.mapPosition.x += dx
      this.mapPosition.y += dy
      this.settings.setHorizontalRouteAlign(false)
      this.settings.setVerticalRouteAlign(false)
    } else if (this.dragTarget === 'stats') {
      this.statsPosition.x += dx
      this.statsPosition.y += dy
      this.settings.setHorizontalStatsAlign(false)
      this.settings.setVerticalStatsAlign(false)
    }
  }

  getDistance(touch1: Touch, touch2: Touch) {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.hypot(dx, dy)
  }

  endDrag = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
        this.dragging = false;
        this.dragTarget = null;
        this.resizing = false;
        this.cleanupListeners();
        return;
    }

    if (event instanceof TouchEvent) {
        if (event.touches.length === 1) {
            // Keep dragging for the active touch
            const touch = event.touches[0];
            this.startX = touch.clientX;
            this.startY = touch.clientY;
        } else if (event.touches.length === 0) {
            // End drag if no touches left
            this.dragging = false;
            this.dragTarget = null;
            this.resizing = false;
            this.cleanupListeners();
        }
    }
}

  checkTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      this.startX = event.touches[0].clientX
      this.startY = event.touches[0].clientY
    }
  }

  cleanupListeners() {
    window.removeEventListener('mousemove', this.move)
    window.removeEventListener('touchmove', this.move)
    window.removeEventListener('mouseup', this.endDrag)
    window.removeEventListener('touchend', this.endDrag)
    window.removeEventListener('touchstart', this.checkTouchStart)
  }

  toggleRouteSettings() {
    this.bottomSheet.open(RouteSettingsComponent)
  }

  toggleStatsSettings() {
    this.bottomSheet.open(StatsSettingsComponent)
  }

  toggleTemplates() {
    this.bottomSheet.open(TemplatesComponent)
  }

  toggleExport() {
    this.settings.setGridLines(false)
    this.bottomSheet.open(ExportComponent)
  }

  toggleImageSettings() {
    this.bottomSheet.open(ImageSettingsComponent)
  }

  onTouchStart(event: TouchEvent) {
    event.preventDefault();
  
    if (event.touches.length === 2) {
      if (this.resizing || this.dragging) { return; }
      this.settings.setHorizontalImageAlign(false)
      this.settings.setVerticalImageAlign(false)
  
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
  
      const startX = (touch1.clientX + touch2.clientX) / 2;
      const startY = (touch1.clientY + touch2.clientY) / 2;
  
      // Track the initial position of the image
      const initialImageX = this.imagePositionX;
      const initialImageY = this.imagePositionY;
  
      // Calculate initial distances and scale factors for resizing
      const startDist = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const initialScale = this.scale;
  
      const onMove = (moveEvent: TouchEvent) => {
        if (moveEvent.touches.length !== 2) return;
  
        const moveTouch1 = moveEvent.touches[0];
        const moveTouch2 = moveEvent.touches[1];
  
        const currentX = (moveTouch1.clientX + moveTouch2.clientX) / 2;
        const currentY = (moveTouch1.clientY + moveTouch2.clientY) / 2;
  
        const dx = currentX - startX;
        const dy = currentY - startY;
  
        // Update the offset, but prevent resetting the image position
        this.offsetX = initialImageX + dx;
        this.offsetY = initialImageY + dy;
  
        // Set the new position of the image relative to its last position
        this.imagePositionX = initialImageX + dx;
        this.imagePositionY = initialImageY + dy;
  
        const currentDist = Math.hypot(
          moveTouch2.clientX - moveTouch1.clientX,
          moveTouch2.clientY - moveTouch1.clientY
        );
        const scaleFactor = currentDist / startDist;
        this.scale = Math.max(0.5, Math.min(4, initialScale * scaleFactor));
      };
  
      const onEnd = () => {
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      };
  
      document.addEventListener('touchmove', onMove);
      document.addEventListener('touchend', onEnd);
    }
  }
}