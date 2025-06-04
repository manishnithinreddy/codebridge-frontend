import { Routes } from '@angular/router';
import { ApiTestRunnerComponent } from './api-test-runner/api-test-runner.component';
import { ApiTestListComponent } from './api-test-list/api-test-list.component';
import { ApiTestFormComponent } from './api-test-form/api-test-form.component';
import { ApiTestRunComponent } from './api-test-run/api-test-run.component';

export const API_TEST_ROUTES: Routes = [
  {
    path: '',
    component: ApiTestListComponent,
    title: 'CodeBridge - API Tests'
  },
  {
    path: 'manual',
    component: ApiTestRunnerComponent,
    title: 'CodeBridge - Manual API Tester'
  },
  {
    path: 'create',
    component: ApiTestFormComponent,
    title: 'CodeBridge - Create API Test'
  },
  {
    path: 'edit/:id',
    component: ApiTestFormComponent,
    title: 'CodeBridge - Edit API Test'
  },
  {
    path: 'run/:id',
    component: ApiTestRunComponent,
    title: 'CodeBridge - Run API Test'
  }
];

