import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';
// Corrected path: ../../core instead of ../../../core
import { WebViewBridgeService, WebViewMessage } from '../../core/services/web-view-bridge.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, JsonPipe, MatButtonModule, MatCardModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private webViewBridgeService = inject(WebViewBridgeService);
  private CBRIDGE_PREFIX = 'CBRIDGE::';

  lastMessageFromHost: WebViewMessage | null = null;
  private messageSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.messageSubscription = this.webViewBridgeService.messageFromHost$.subscribe(
      (message: WebViewMessage) => {
        this.lastMessageFromHost = message;
        if (message.type === `${this.CBRIDGE_PREFIX}USER_PREFERENCES_UPDATED`) {
          console.log('HomeComponent: User preferences updated from host:', message.payload);
        }
      }
    );
    this.webViewBridgeService.sendMessageToHost(`${this.CBRIDGE_PREFIX}GET_INITIAL_DATA`, { component: 'HomeComponent' });
  }

  sendTestMessageToHost(): void {
    const testPayload = { timestamp: new Date().toISOString(), data: 'Hello from Angular WebView!' };
    this.webViewBridgeService.sendMessageToHost(`${this.CBRIDGE_PREFIX}TEST_MESSAGE`, testPayload);
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
