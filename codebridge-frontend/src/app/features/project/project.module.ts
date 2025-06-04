import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectFormComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ProjectListComponent,
    ProjectFormComponent
  ]
})
export class ProjectModule { }

