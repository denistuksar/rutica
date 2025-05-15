import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedSettingsService } from '../../services/shared-settings.service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-route-settings',
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSliderModule
  ],
  templateUrl: './route-settings.component.html',
  styleUrl: './route-settings.component.scss'
})
export class RouteSettingsComponent implements OnInit {
  mapColor: any = '#fff'
  displayRoute: boolean = true
  horizontal: boolean = false
  vertical: boolean = false
  opacity: string = '1'
  width: string = '1'

  constructor(
    private settings: SharedSettingsService,
    private bottomSheetRef: MatBottomSheetRef<RouteSettingsComponent>
  ) { }

  ngOnInit(): void {
    this.mapColor = this.settings.mapColor()
    this.displayRoute = this.settings.displayRoute()
    this.horizontal = this.settings.horizontalRouteAlign()
    this.vertical = this.settings.verticalRouteAlign()
    this.opacity = this.settings.mapOpacity()
  }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value
    this.mapColor = color
    this.settings.setMapColor(color)
    if (this.settings.sameStatsColor()) {
      this.settings.setStatsColor(this.mapColor)
    }
  }

  onDisplayRoute(event: MatSlideToggleChange) {
    this.settings.setDisplayRoute(event.checked)
  }

  horizontalAlign() {
    this.horizontal = !this.horizontal
    this.settings.setHorizontalRouteAlign(this.horizontal)
  }

  verticalAlign() {
    this.vertical = !this.vertical
    this.settings.setVerticalRouteAlign(this.vertical)
  }

  setOpacity(event: Event) {
    const opacity = (event.target as HTMLInputElement).value
    this.settings.setMapOpacity(opacity)
  }

  setWidth(event: Event) {
    const width = (event.target as HTMLInputElement).value
    this.settings.setMapStrokeWidth(width)
  }

  closeSheet() {
    this.bottomSheetRef.dismiss();
  }

}
