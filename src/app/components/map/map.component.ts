import { CommonModule } from '@angular/common';
import { Component, effect, Input } from '@angular/core';
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
export class MapComponent {
  @Input() activity: ActivityModel | undefined
  @Input() color: string = "#fff"
  strokeWidth = '0.5'

  constructor(private settings: SharedSettingsService) {}

  getPoints(encoded: string): string {
    const coords = polyline.decode(encoded)
  
    const lats = coords.map(([lat]) => lat)
    const lngs = coords.map(([, lng]) => lng)
  
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
  
    const padding = 5
    const svgWidth = 50
    const svgHeight = 50
  
    const mapWidth = svgWidth - 2 * padding
    const mapHeight = svgHeight - 2 * padding
  
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
        const y = svgHeight - (offsetY + (lat - minLat) * latToKm * scale)
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

  private strokeEffect = effect(() => {
    this.strokeWidth = this.settings.mapStrokeWidth()
  })
}
