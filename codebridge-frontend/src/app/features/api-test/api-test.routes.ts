import { Routes } from '@angular/router';
import { ApiTestRunnerComponent } from './api-test-runner.component';

export const API_TEST_ROUTES: Routes = [
  {
    path: '',
    component: ApiTestRunnerComponent,
    title: 'CodeBridge - API Tester'
  }
];
