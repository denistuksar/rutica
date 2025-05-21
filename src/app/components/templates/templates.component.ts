import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SharedSettingsService } from '../../services/shared-settings.service';

@Component({
  selector: 'app-templates',
  imports: [
    CommonModule
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
  templatePreviews = [
    { id: 1, src: 'assets/template-previews/1.png', name: 'Strava Default', cssClass: 'strava-default' }
  ]
  selectedTemplateId: number | undefined = undefined

  constructor(
    private bottomSheetRef: MatBottomSheetRef<TemplatesComponent>,
    private settings: SharedSettingsService
  ) { }

  private selectedTemplateEffect = effect(() => {
    if (this.settings.selectedTemplate()) {
      const template = this.templatePreviews.find(el => el.cssClass === this.settings.selectedTemplate())
      this.selectedTemplateId = template?.id
    }
  })

  closeSheet() {
    this.bottomSheetRef.dismiss();
  }

  selectTemplate(id: number) {
    let template
    if (this.selectedTemplateId === id) {
      this.selectedTemplateId = undefined
      template = undefined
      this.settings.resetAll()
    } else {
      this.selectedTemplateId = id
      template = this.templatePreviews.find(el => el.id === id)
    }
    this.settings.setSelectedTemplate(template?.cssClass)
  }

}
