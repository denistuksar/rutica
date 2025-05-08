import { Component, effect, Input, OnInit } from '@angular/core';
import { ActivityModel } from '../../models/activity.model';
import { CommonModule } from '@angular/common';
import { PaceFormatPipe } from '../../pipes/pace-format.pipe';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';
import { SharedSettingsService } from '../../services/shared-settings.service';

@Component({
  selector: 'app-activity-stats',
  imports: [
    CommonModule,
    PaceFormatPipe,
    DurationFormatPipe
  ],
  templateUrl: './activity-stats.component.html',
  styleUrl: './activity-stats.component.scss'
})
export class ActivityStatsComponent {
  @Input() activity: ActivityModel | undefined
  @Input() color: string = "#fff"
  distance: boolean = true
  pace: boolean = true
  time: boolean = true
  elevationGain: boolean = false
  calories: boolean = false
  activityTitle: boolean = true
  columns: number = 3
  centerTitleText: boolean = false
  centerStatsText: boolean = false

  constructor(
    private settings: SharedSettingsService
  ) {}

  private distanceEffect = effect(() => {
    this.distance = this.settings.distance()
  })

  private paceEffect = effect(() => {
    this.pace = this.settings.pace()
  })

  private timeEffect = effect(() => {
    this.time = this.settings.time()
  })

  private elevationGainEffect = effect(() => {
    this.elevationGain = this.settings.elevationGain()
  })

  private caloriesEffect = effect(() => {
    this.calories = this.settings.calories()
  })

  private activityTitleEffect = effect(() => {
    this.activityTitle = this.settings.activityTitle()
  })


  private columnsEffect = effect(() => {
    this.columns = this.settings.columns()
  })

  private centerTitleTextEffect = effect(() => {
    this.centerTitleText = this.settings.centerTitle()
  })

  private centerStatsTextEffect = effect(() => {
    this.centerStatsText = this.settings.centerStats()
  })

  private opacityEffect = effect(() => {
    const opacity = this.settings.statsOpacity()
    const activityInfoEl = document.querySelector('.activity-info') as HTMLElement
    if (activityInfoEl) {
      activityInfoEl.style.opacity = opacity
    }
  })
}
