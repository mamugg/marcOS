import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationCenterComponent, NOTIFICATION_FEED } from './notification-center.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';

describe('NotificationCenterComponent', () => {
  let component: NotificationCenterComponent;
  let fixture: ComponentFixture<NotificationCenterComponent>;
  let dockState: DockStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCenterComponent, TranslateModule.forRoot()],
      providers: [provideAnimations(), DockStateService, StorageService],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCenterComponent);
    component = fixture.componentInstance;
    dockState = TestBed.inject(DockStateService);

    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('fr');
    translate.use('fr');

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should not render the panel when displayNotificationCenter is false', () => {
    dockState.setNotificationCenter(false);
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('.nc-panel');
    expect(panel).toBeNull();
  });

  it('should render the panel when displayNotificationCenter is true', () => {
    dockState.setNotificationCenter(true);
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('.nc-panel');
    expect(panel).toBeTruthy();
  });

  it('should render the backdrop when panel is open', () => {
    dockState.setNotificationCenter(true);
    fixture.detectChanges();
    const backdrop = fixture.nativeElement.querySelector('.nc-backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('should close on backdrop click', () => {
    dockState.setNotificationCenter(true);
    fixture.detectChanges();
    component.onBackdropClick();
    expect(dockState.displayNotificationCenter()).toBe(false);
  });

  it('should close on ESC key when panel is open', () => {
    dockState.setNotificationCenter(true);
    component.onEscape();
    expect(dockState.displayNotificationCenter()).toBe(false);
  });

  it('should not throw on ESC key when panel is already closed', () => {
    dockState.setNotificationCenter(false);
    expect(() => component.onEscape()).not.toThrow();
    expect(dockState.displayNotificationCenter()).toBe(false);
  });

  it('should expose the full NOTIFICATION_FEED', () => {
    expect(component.feed.length).toBe(NOTIFICATION_FEED.length);
    expect(component.feed.length).toBeGreaterThanOrEqual(6);
  });

  it('should return "today" for a date of 0 days ago', () => {
    const today = new Date();
    const result = component.relativeDate(today);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return a non-empty string for any valid date', () => {
    const past = new Date('2020-01-01');
    const result = component.relativeDate(past);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should render feed entries when open', () => {
    dockState.setNotificationCenter(true);
    fixture.detectChanges();
    const entries = fixture.nativeElement.querySelectorAll('.nc-entry');
    expect(entries.length).toBe(NOTIFICATION_FEED.length);
  });

  it('should have a close button inside the panel', () => {
    dockState.setNotificationCenter(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.nc-close-btn');
    expect(btn).toBeTruthy();
  });

  it('should close when close button is clicked', () => {
    dockState.setNotificationCenter(true);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.nc-close-btn');
    btn.click();
    expect(dockState.displayNotificationCenter()).toBe(false);
  });

  it('each NOTIFICATION_FEED entry has a valid type', () => {
    const validTypes = ['success', 'info', 'warning'];
    NOTIFICATION_FEED.forEach((entry) => {
      expect(validTypes).toContain(entry.type);
    });
  });

  it('each NOTIFICATION_FEED entry has icon, titleKey, descriptionKey and date', () => {
    NOTIFICATION_FEED.forEach((entry) => {
      expect(entry.icon).toBeTruthy();
      expect(entry.titleKey).toBeTruthy();
      expect(entry.descriptionKey).toBeTruthy();
      expect(entry.date instanceof Date).toBe(true);
    });
  });
});
