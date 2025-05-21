import { CommonModule } from '@angular/common';
import { Component, effect, Input, OnInit } from '@angular/core';
import polyline from '@mapbox/polyline';
import { ActivityModel } from '../../models/activity.model';
import { SharedSettingsService } from '../../services/shared-settings.service';

@Component({
  selector: 'app-map',
  imports: [
    CommonModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  @Input() activity: ActivityModel | undefined
  @Input() activityList: boolean = false
  @Input() color: string = "#fff"
  @Input() customCssClass = ''
  svgWidth!: number
  svgHeight!: number
  strokeWidth: string = ''

  constructor(private settings: SharedSettingsService) { }

  ngOnInit(): void {
    this.svgWidth = this.activityList ? 30 : 50
    this.svgHeight = this.activityList ? 30 : 50
    this.activityList ? this.settings.setMapStrokeWidth('0.6') : this.settings.setMapStrokeWidth('1')
    switch (this.customCssClass) {
      case 'strava-default':
        this.settings.setMapColor('#FC4C02')
        break;
      default:
        break;
    }
  }

  getPoints(encoded: string): string {
    const coords = polyline.decode(encoded)

    const lats = coords.map(([lat]) => lat)
    const lngs = coords.map(([, lng]) => lng)

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    const padding = 5
    const mapWidth = this.svgWidth - 2 * padding
    const mapHeight = this.svgHeight - 2 * padding

    const midLat = (minLat + maxLat) / 2
    const latToKm = 111 // rough constant
    const lngToKm = 111 * Math.cos(midLat * Math.PI / 180)

    const widthInKm = (maxLng - minLng) * lngToKm
    const heightInKm = (maxLat - minLat) * latToKm
    const dataAspect = widthInKm / heightInKm
    const svgAspect = mapWidth / mapHeight

    let scale = 1
    let offsetX = padding
    let offsetY = padding

    if (dataAspect > svgAspect) {
      // Fit by width
      scale = mapWidth / widthInKm
      const drawingHeight = heightInKm * scale
      offsetY += (mapHeight - drawingHeight) / 2
    } else {
      // Fit by height
      scale = mapHeight / heightInKm
      const drawingWidth = widthInKm * scale
      offsetX += (mapWidth - drawingWidth) / 2
    }

    return coords
      .map(([lat, lng]) => {
        const x = offsetX + (lng - minLng) * lngToKm * scale
        const y = this.svgHeight - (offsetY + (lat - minLat) * latToKm * scale)
        return `${x},${y}`
      })
      .join(' ')
  }

  private opacityEffect = effect(() => {
    const opacity = this.settings.mapOpacity()
    const mapEl = document.querySelector('.map-container') as HTMLElement
    if (mapEl) {
      mapEl.style.opacity = opacity
    }
  })

  private mapColorEffect = effect(() => {
    this.color = this.settings.mapColor()
  })

  private strokeEffect = effect(() => {
    this.strokeWidth = this.settings.mapStrokeWidth()
  })
}
