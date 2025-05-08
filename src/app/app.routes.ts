import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { UploadPhotoComponent } from './components/upload-photo/upload-photo.component';
import { OverlayEditorComponent } from './components/overlay-editor/overlay-editor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'activity-list', component: ActivityListComponent },
  { path: 'upload/:activityId', component: UploadPhotoComponent },
  { path: 'overlay-editor/:activityId', component: OverlayEditorComponent }
];