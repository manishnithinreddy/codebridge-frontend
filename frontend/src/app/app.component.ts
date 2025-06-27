import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root', 
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.scss'], 
  standalone: true,
  imports: [ 
    CommonModule, 
    RouterModule, 
    MatSidenavModule, 
    MatToolbarModule, 
    MatListModule, 
    MatIconModule, 
    MatButtonModule, 
    MatMenuModule 
  ]
})
export class AppComponent {
  private breakpointObserver = inject(BreakpointObserver);
  title = 'CodeBridge';
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}

