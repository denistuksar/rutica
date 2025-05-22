import { Component, effect, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivityModel } from '../../models/activity.model';
import { CommonModule } from '@angular/common';
import { PaceFormatPipe } from '../../pipes/pace-format.pipe';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';
import { SharedSettingsService } from '../../services/shared-settings.service';
import { ActivityDatePipe } from '../../pipes/activity-date-format.pipe copy';

@Component({
  selector: 'app-activity-stats',
  imports: [
    CommonModule,
    PaceFormatPipe,
    DurationFormatPipe,
    ActivityDatePipe
  ],
  templateUrl: './activity-stats.component.html',
  styleUrl: './activity-stats.component.scss'
})
export class ActivityStatsComponent implements OnInit, OnChanges {
  @Input() activity: ActivityModel | undefined
  @Input() color: string = "#fff"
  @Input() activityList: boolean = false
  @Input() customCssClass = ''
  distance: boolean = true
  pace: boolean = true
  time: boolean = true
  elevationGain: boolean = false
  avgHeartRate: boolean = false
  calories: boolean = false
  activityTitle: boolean = true
  description: boolean = false
  columns: number = 3
  columnGap: number = 10
  rowGap: number = 10
  centerTitleText: boolean = false
  centerStatsText: boolean = false
  fontFamily: string = 'Roboto'

  constructor(
    private settings: SharedSettingsService
  ) { }

  ngOnInit(): void {
    this.settings.setFontFamily('Helvetica')
  }

  ngOnChanges(): void {
    switch (this.customCssClass) {
      case 'strava-default':
        this.settings.setStatsColumns(1)
        this.settings.toggleActivityTitle(false)
        this.settings.toggleCenterStatsText(true)
        this.activityTitle = false
        break;
      default:
      case 'nike':
        this.settings.setColumnGap(15)
        break;
    }
  }

  private distanceEffect = effect(() => {
    this.distance = this.settings.distance()
  })

  private fontFamilyEffect = effect(() => {
    this.fontFamily = this.settings.fontFamily()
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

  private avgHeartRateEffect = effect(() => {
    this.avgHeartRate = this.settings.avgHeartRate()
  })

  private caloriesEffect = effect(() => {
    this.calories = this.settings.calories()
  })

  private activityTitleEffect = effect(() => {
    this.activityTitle = this.settings.activityTitle()
  })

  private descriptionEffect = effect(() => {
    this.description = this.settings.description()
  })

  private columnsEffect = effect(() => {
    this.columns = this.settings.columns()
  })

  private columnGapEffect = effect(() => {
    this.columnGap = this.settings.columnGap()
  })

  private rwoGapEffect = effect(() => {
    this.rowGap = this.settings.rowGap()
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
