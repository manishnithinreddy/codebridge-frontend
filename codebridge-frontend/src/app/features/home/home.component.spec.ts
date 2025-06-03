import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { WebViewBridgeService } from '../../core/services/web-view-bridge.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockWebViewBridgeService {
  messageFromHost$ = of(null);
  sendMessageToHost = jasmine.createSpy('sendMessageToHost');
  getMessageByType = jasmine.createSpy('getMessageByType').and.returnValue(of(null));
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let webViewBridgeService: WebViewBridgeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HomeComponent, NoopAnimationsModule ],
      providers: [ { provide: WebViewBridgeService, useClass: MockWebViewBridgeService } ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    webViewBridgeService = TestBed.inject(WebViewBridgeService);
    fixture.detectChanges();
  });

  it('should create the component', () => { expect(component).toBeTruthy(); });
  it('should display welcome message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome to CodeBridge!');
  });
  it('should call WebViewBridgeService.sendMessageToHost on sendTestMessageToHost()', () => {
    component.sendTestMessageToHost();
    expect(webViewBridgeService.sendMessageToHost).toHaveBeenCalled();
  });
  it('should call sendMessageToHost with GET_INITIAL_DATA on init', () => {
    expect(webViewBridgeService.sendMessageToHost).toHaveBeenCalledWith('CBRIDGE::GET_INITIAL_DATA', { component: 'HomeComponent' });
  });
});
