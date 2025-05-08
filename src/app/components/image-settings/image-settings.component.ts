import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedSettingsService } from '../../services/shared-settings.service';

@Component({
  selector: 'app-image-settings',
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './image-settings.component.html',
  styleUrl: './image-settings.component.scss'
})
export class ImageSettingsComponent implements OnInit {
  showGridLines = false
  backgroundColor: any = '#fff'
  horizontal: boolean = false
  vertical: boolean = false

  constructor(private settings: SharedSettingsService) {}
  

  ngOnInit(): void {
    this.showGridLines = this.settings.gridLines()
    this.horizontal = this.settings.horizontalImageAlign()
    this.vertical = this.settings.verticalImageAlign()
    this.backgroundColor = this.settings.bgColor()
  }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value
    this.backgroundColor = color;
    this.settings.setBgColor(this.backgroundColor)
  }

  onGridLinesTrigger(event: MatSlideToggleChange) {
    this.settings.setGridLines(event.checked)
  }

  horizontalAlign() {
    this.horizontal = !this.horizontal
    this.settings.setHorizontalImageAlign(this.horizontal)
  }

  verticalAlign() {
    this.vertical = !this.vertical
    this.settings.setVerticalImageAlign(this.vertical)
  }
}