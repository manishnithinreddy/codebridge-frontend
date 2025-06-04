import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { EnvironmentListComponent } from './environment-list/environment-list.component';
import { EnvironmentFormComponent } from './environment-form/environment-form.component';

@NgModule({
  declarations: [
    EnvironmentListComponent,
    EnvironmentFormComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    EnvironmentListComponent,
    EnvironmentFormComponent
  ]
})
export class EnvironmentModule { }

