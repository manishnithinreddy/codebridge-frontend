import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface WebViewMessage { type: string; payload?: any; source?: string; }
const TARGET_ORIGIN = '*';
@Injectable({ providedIn: 'root' })
export class WebViewBridgeService {
  private messageFromHostSubject = new Subject<WebViewMessage>();
  public messageFromHost$: Observable<WebViewMessage> = this.messageFromHostSubject.asObservable();
  constructor(private ngZone: NgZone) {
    window.addEventListener('message', (event) => {
      const message = event.data as WebViewMessage;
      if (message && message.type) {
        console.log('WebViewBridgeService: Message received from host:', message);
        this.ngZone.run(() => { this.messageFromHostSubject.next(message); });
      }
    });
  }
  sendMessageToHost(type: string, payload?: any): void {
    const message: WebViewMessage = { type, payload, source: 'CodeBridgeFrontend' };
    console.log('WebViewBridgeService: Sending message to host:', message);
    if (window.parent && window.parent !== window) { window.parent.postMessage(message, TARGET_ORIGIN); }
    else if (window.opener) { window.opener.postMessage(message, TARGET_ORIGIN); }
    else {
      console.warn('WebViewBridgeService: Not in a WebView or no host window found.');
      setTimeout(() => { this.ngZone.run(() => { this.messageFromHostSubject.next({ type: 'mockHostResponse', payload: { originalType: type, status: 'simulated success' } }); }); }, 500);
    }
  }
  getMessageByType<T_Payload>(type: string): Observable<T_Payload> {
    return this.messageFromHost$.pipe(
      filter((message: WebViewMessage) => message.type === type),
      map(message => message.payload as T_Payload),
      filter(payload => payload !== undefined)
    );
  }
}
