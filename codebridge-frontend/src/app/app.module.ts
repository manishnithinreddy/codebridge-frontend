import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { ProjectModule } from './features/project/project.module';
import { CollectionModule } from './features/collection/collection.module';
import { EnvironmentModule } from './features/environment/environment.module';
import { ProjectSharingModule } from './features/project-sharing/project-sharing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    ProjectModule,
    CollectionModule,
    EnvironmentModule,
    ProjectSharingModule
  ],
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

