import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ProjectSharingListComponent } from './project-sharing-list/project-sharing-list.component';

@NgModule({
  declarations: [
    ProjectSharingListComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ProjectSharingListComponent
  ]
})
export class ProjectSharingModule { }

