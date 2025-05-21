import { Injectable } from '@angular/core';
import { signal } from '@angular/core'; // Import signal
import { ActivityModel } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class SharedSettingsService {
  // Replace BehaviorSubject with signal
  mapColor = signal<string>('#fc4c02');
  bgColor = signal<string>('#ffffff');
  statsColor = signal<string>('#ffffff');
  statsOpacity = signal<string>('1');
  mapStrokeWidth = signal<string>('1');
  mapOpacity = signal<string>('1');
  fontFamily = signal<string>('Roboto');
  uploadedPhoto = signal<File | null>(null);
  sameStatsColor = signal<boolean>(false);
  gridLines = signal<boolean>(false);
  displayRoute = signal<boolean>(true);
  horizontalImageAlign = signal<boolean>(false);
  verticalImageAlign = signal<boolean>(false);
  horizontalRouteAlign = signal<boolean>(false);
  verticalRouteAlign = signal<boolean>(false);
  horizontalStatsAlign = signal<boolean>(false);
  verticalStatsAlign = signal<boolean>(false);
  centerTitle = signal<boolean>(false);
  centerStats = signal<boolean>(false);
  loading = signal<boolean>(false);
  distance = signal<boolean>(true);
  pace = signal<boolean>(true);
  time = signal<boolean>(true);
  elevationGain = signal<boolean>(false);
  avgHeartRate = signal<boolean>(false);
  calories = signal<boolean>(false);
  activityTitle = signal<boolean>(true);
  description = signal<boolean>(false);
  columns = signal<number>(3);
  columnGap = signal<number>(10);
  rowGap = signal<number>(10);
  selectedTemplate = signal<string | undefined>(undefined);
  activity = signal<ActivityModel | undefined>(undefined);

  setActivity(activity: ActivityModel | undefined) {
    this.activity.set(activity);  // Update signal
  }

  // Methods to update the signals
  setMapColor(color: string) {
    this.mapColor.set(color);  // Update signal
  }

  setBgColor(color: string) {
    this.bgColor.set(color);  // Update signal
  }

  setStatsColor(color: string) {
    this.statsColor.set(color);  // Update signal
  }

  setStatsOpacity(value: string) {
    this.statsOpacity.set(value);  // Update signal
  }

  setFontFamily(value: string) {
    this.fontFamily.set(value);  // Update signal
  }

  setColumnGap(value: number) {
    this.columnGap.set(value)
  }

  setSelectedTemplate(value: string | undefined) {
    this.selectedTemplate.set(value)
  }

  setRowGap(value: number) {
    this.rowGap.set(value)
  }

  setMapStrokeWidth(value: string) {
    this.mapStrokeWidth.set(value);  // Update signal
  }

  setMapOpacity(value: string) {
    this.mapOpacity.set(value);  // Update signal
  }

  setSameStatsColor(toggled: boolean) {
    this.sameStatsColor.set(toggled);  // Update signal
  }

  setGridLines(toggled: boolean) {
    this.gridLines.set(toggled);  // Update signal
  }

  setDisplayRoute(toggled: boolean) {
    this.displayRoute.set(toggled);  // Update signal
  }

  setHorizontalImageAlign(horizontal: boolean) {
    this.horizontalImageAlign.set(horizontal);  // Update signal
  }

  setVerticalImageAlign(vertical: boolean) {
    this.verticalImageAlign.set(vertical);  // Update signal
  }

  setHorizontalRouteAlign(horizontal: boolean) {
    this.horizontalRouteAlign.set(horizontal);  // Update signal
  }

  setVerticalRouteAlign(vertical: boolean) {
    this.verticalRouteAlign.set(vertical);  // Update signal
  }

  setHorizontalStatsAlign(horizontal: boolean) {
    this.horizontalStatsAlign.set(horizontal);  // Update signal
  }

  setVerticalStatsAlign(vertical: boolean) {
    this.verticalStatsAlign.set(vertical);  // Update signal
  }

  setLoading(loading: boolean) {
    this.loading.set(loading);  // Update signal
  }

  toggleDistance(toggle: boolean) {
    this.distance.set(toggle);  // Update signal
  }

  togglePace(toggle: boolean) {
    this.pace.set(toggle);  // Update signal
  }

  toggleTime(toggle: boolean) {
    this.time.set(toggle);  // Update signal
  }

  toggleElevationGain(toggle: boolean) {
    this.elevationGain.set(toggle);  // Update signal
  }

  toggleAvgHeartRate(toggle: boolean) {
    this.avgHeartRate.set(toggle);  // Update signal
  }

  toggleCalories(toggle: boolean) {
    this.calories.set(toggle);  // Update signal
  }

  toggleActivityTitle(toggle: boolean) {
    this.activityTitle.set(toggle);  // Update signal
  }

  toggleDescription(toggle: boolean) {
    this.description.set(toggle);  // Update signal
  }

  toggleCenterTitleText(toggle: boolean) {
    this.centerTitle.set(toggle);  // Update signal
  }

  toggleCenterStatsText(toggle: boolean) {
    this.centerStats.set(toggle);  // Update signal
  }

  setUploadedPhoto(file: File) {
    this.uploadedPhoto.set(file);  // Update signal
  }

  setStatsColumns(count: number) {
    this.columns.set(count)
  }

  resetAll() {
    this.mapColor.set('#fc4c02')
    this.bgColor.set('#ffffff')
    this.statsColor.set('#ffffff')
    this.statsOpacity.set('1')
    this.mapStrokeWidth.set('1')
    this.mapOpacity.set('1')
    this.fontFamily.set('Roboto')
    this.selectedTemplate.set(undefined)
    this.columns.set(3)
    this.columnGap.set(10)
    this.rowGap.set(10)
    this.uploadedPhoto.set(null)
    this.sameStatsColor.set(false)
    this.centerTitle.set(false)
    this.centerStats.set(false)
    this.gridLines.set(false)
    this.displayRoute.set(true)
    this.horizontalImageAlign.set(false)
    this.verticalImageAlign.set(false)
    this.horizontalRouteAlign.set(false)
    this.verticalRouteAlign.set(false)
    this.horizontalStatsAlign.set(false)
    this.verticalStatsAlign.set(false)
    this.loading.set(false)
    this.distance.set(true)
    this.pace.set(true)
    this.time.set(true)
    this.elevationGain.set(false)
    this.avgHeartRate.set(false)
    this.calories.set(false)
    this.activityTitle.set(true)
    this.description.set(false)
  }
}