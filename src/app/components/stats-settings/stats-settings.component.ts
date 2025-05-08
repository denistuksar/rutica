import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedSettingsService } from '../../services/shared-settings.service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-stats-settings',
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSliderModule
  ],
  templateUrl: './stats-settings.component.html',
  styleUrl: './stats-settings.component.scss'
})
export class StatsSettingsComponent implements OnInit {
  statsColor: any = '#fff'
  sameColor: boolean = false
  horizontal: boolean = false
  vertical: boolean = false
  distance: boolean = false
  pace: boolean = false
  time: boolean = false
  elevationGain: boolean = false
  calories: boolean = false
  centerTitle: boolean = false
  centerStats: boolean = false
  activityTitle: boolean = true
  opacity: string = '1'
  columns: number = 3

  constructor(private settings: SharedSettingsService) {}

  ngOnInit(): void {
    this.sameColor = this.settings.sameStatsColor()
    this.horizontal = this.settings.horizontalStatsAlign()
    this.vertical = this.settings.verticalStatsAlign()
    this.statsColor = this.settings.statsColor()
    this.distance = this.settings.distance()
    this.pace = this.settings.pace()
    this.time = this.settings.time()
    this.activityTitle = this.settings.activityTitle()
    this.elevationGain = this.settings.elevationGain()
    this.calories = this.settings.calories()
    this.opacity = this.settings.statsOpacity()
    this.columns = this.settings.columns()
    this.centerStats = this.settings.centerStats()
    this.centerTitle = this.settings.centerTitle()
  }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value
    this.statsColor = color
    this.settings.setStatsColor(color)
    this.sameColor = false
  }

  setOpacity(event: Event) {
    const opacity = (event.target as HTMLInputElement).value
    this.settings.setStatsOpacity(opacity)
  }

  setColor(event: MatSlideToggleChange) {
    const sameColor = event.checked;
    if (sameColor) {
      // Directly access the value of the signal (no need for subscribe)
      const mapColor = this.settings.mapColor(); // Get the current value of the mapColor signal
      this.settings.setStatsColor(mapColor); // Update statsColor with mapColor value
      this.settings.setSameStatsColor(true)
    } else {
      this.settings.setStatsColor(this.statsColor); // Set the previously selected statsColor
      this.settings.setSameStatsColor(false)
    }
  }

  horizontalAlign() {
    this.horizontal = !this.horizontal
    this.settings.setHorizontalStatsAlign(this.horizontal)
  }

  verticalAlign() {
    this.vertical = !this.vertical
    this.settings.setVerticalStatsAlign(this.vertical)
  }

  toggleDistance(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleDistance(event.checked)
  }

  togglePace(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.togglePace(event.checked)
  }

  toggleTime(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleTime(event.checked)
  }

  toggleElevationGain(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleElevationGain(event.checked)
  }

  toggleCalories(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleCalories(event.checked)
  }

  toggleActivityTitle(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleActivityTitle(event.checked)
  }

  toggleCenterTitle(event: MatSlideToggleChange) {
    this.centerTitle = event.checked
    this.settings.toggleCenterTitleText(event.checked)
  }

  toggleCenterStats(event: MatSlideToggleChange) {
    this.settings.toggleCenterStatsText(event.checked)
  }

  resetAlignment () {
    this.horizontal = false
    this.vertical = false
    this.settings.setHorizontalStatsAlign(false)
    this.settings.setVerticalStatsAlign(false)
  }

  setLayout (count: number) {
    this.columns = count
    this.settings.setStatsColumns(count)   
    this.resetAlignment()
  }
}
