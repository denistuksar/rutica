import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedSettingsService } from '../../services/shared-settings.service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { ActivityModel } from '../../models/activity.model';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import WebFont from 'webfontloader'

@Component({
  selector: 'app-stats-settings',
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSliderModule,
    MatSelectModule,
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
  avgHeartRate: boolean = false
  calories: boolean = false
  centerTitle: boolean = false
  centerStats: boolean = false
  activityTitle: boolean = true
  description: boolean = false
  opacity: string = '1'
  columnGap: number = 10
  rowGap: number = 10
  columns: number = 3
  selectedFontFamily: string = ''
  activity: ActivityModel | undefined
  loadedFonts = new Set<string>()

  fontGroups: { label: string, fonts: string[] }[] = []

  constructor(
    private settings: SharedSettingsService,
    private bottomSheetRef: MatBottomSheetRef<StatsSettingsComponent>,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.sameColor = this.settings.sameStatsColor()
    this.horizontal = this.settings.horizontalStatsAlign()
    this.vertical = this.settings.verticalStatsAlign()
    this.statsColor = this.settings.statsColor()
    this.distance = this.settings.distance()
    this.pace = this.settings.pace()
    this.time = this.settings.time()
    this.activityTitle = this.settings.activityTitle()
    this.description = this.settings.description()
    this.elevationGain = this.settings.elevationGain()
    this.avgHeartRate = this.settings.avgHeartRate()
    this.calories = this.settings.calories()
    this.opacity = this.settings.statsOpacity()
    this.columns = this.settings.columns()
    this.centerStats = this.settings.centerStats()
    this.centerTitle = this.settings.centerTitle()
    this.columnGap = this.settings.columnGap()
    this.rowGap = this.settings.rowGap()
    this.selectedFontFamily = this.settings.fontFamily()
    this.isSameColor()
    this.setupFonts()
    this.fontGroups.flatMap(group => group.fonts).forEach(font => this.loadFont(font))
  }

  setupFonts() {
    this.fontGroups = [
      {
        label: 'Sans-serif (modern, clean, versatile)',
        fonts: ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Nunito', 'Source Sans Pro']
      },
      {
        label: 'Serif (classic, elegant, formal)',
        fonts: ['Merriweather', 'Playfair Display', 'Roboto Slab', 'Georgia']
      },
      {
        label: 'Display & Handwriting (for fun, personality)',
        fonts: ['Pacifico', 'Raleway', 'Dancing Script', 'Great Vibes']
      },
      {
        label: 'Fun & Quirky Fonts',
        fonts: [
          'Comic Neue',
          'Fredoka One',
          'Bangers',
          'Luckiest Guy',
          'Permanent Marker',
          'Indie Flower'
        ]
      }
    ]

    const allFonts = this.fontGroups.flatMap(group => group.fonts)

    WebFont.load({
      google: {
        families: allFonts
      },
      active: () => {
        if (!this.selectedFontFamily) {
          this.selectedFontFamily = allFonts[0]
        }
      }
    })

    if (!this.selectedFontFamily) {
      this.selectedFontFamily = allFonts[0]
    }
  }

  loadFont(font: string) {
    if (this.loadedFonts.has(font)) return

    // Use WebFont loader to actually load the font from Google Fonts
    WebFont.load({
      google: {
        families: [font]
      },
      active: () => {
        // When font is loaded, add to loadedFonts and trigger change detection if needed
        this.loadedFonts.add(font)
      },
      inactive: () => {
        console.warn(`Failed to load font: ${font}`)
      }
    })
  }

  private activityEffect = effect(() => {
    this.activity = this.settings.activity()
  })

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value
    this.statsColor = color
    this.settings.setStatsColor(color)
    this.sameColor = false
  }

  isSameColor() {
    if (this.statsColor === this.settings.mapColor()) {
      this.sameColor = true
    }
  }

  setOpacity(event: Event) {
    const opacity = (event.target as HTMLInputElement).value
    this.settings.setStatsOpacity(opacity)
  }

  setColumnGap(event: Event) {
    const columnGap = (event.target as HTMLInputElement).value
    this.settings.setColumnGap(parseInt(columnGap))
  }

  setRowGap(event: Event) {
    const rowGap = (event.target as HTMLInputElement).value
    this.settings.setRowGap(parseInt(rowGap))
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

  toggleAvgHeartRate(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleAvgHeartRate(event.checked)
  }

  toggleCalories(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleCalories(event.checked)
  }

  toggleActivityTitle(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleActivityTitle(event.checked)
  }

  toggleActivityDescription(event: MatSlideToggleChange) {
    this.resetAlignment()
    this.settings.toggleDescription(event.checked)
  }

  toggleCenterTitle(event: MatSlideToggleChange) {
    this.centerTitle = event.checked
    this.settings.toggleCenterTitleText(event.checked)
  }

  toggleCenterStats(event: MatSlideToggleChange) {
    this.settings.toggleCenterStatsText(event.checked)
  }

  resetAlignment() {
    this.horizontal = false
    this.vertical = false
    this.settings.setHorizontalStatsAlign(false)
    this.settings.setVerticalStatsAlign(false)
  }

  setLayout(count: number) {
    this.columns = count
    this.settings.setStatsColumns(count)
    this.resetAlignment()
  }

  fontChanged() {
    this.settings.setFontFamily(this.selectedFontFamily)
    this.loadFont(this.selectedFontFamily)
  }

  formatFontFamily(font: string): string {
    return `"${font}"`
  }

  closeSheet() {
    this.bottomSheetRef.dismiss();
  }
}
