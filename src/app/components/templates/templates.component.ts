import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-templates',
  imports: [],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<TemplatesComponent>,
  ) { }

  closeSheet() {
    this.bottomSheetRef.dismiss();
  }

}
