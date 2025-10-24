import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';

@NgModule({
  declarations: [
    CollectionListComponent,
    CollectionFormComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    CollectionListComponent,
    CollectionFormComponent
  ]
})
export class CollectionModule { }

