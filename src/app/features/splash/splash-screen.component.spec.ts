import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import { SplashScreenComponent } from './splash-screen.component';

describe('SplashScreenComponent — normal boot', () => {
  let fixture: ComponentFixture<SplashScreenComponent>;
  let component: SplashScreenComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    sessionStorage.removeItem('marcOS_skipSplash');

    await TestBed.configureTestingModule({
      imports: [SplashScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SplashScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.removeItem('marcOS_skipSplash');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be visible on init', () => {
    expect(component.visible()).toBe(true);
    expect(component.exiting()).toBe(false);
  });

  it('should render the splash overlay while visible', () => {
    const overlay: HTMLElement = fixture.nativeElement.querySelector('.splash-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should render the logo', () => {
    const logo: HTMLImageElement = fixture.nativeElement.querySelector('.splash-logo');
    expect(logo).toBeTruthy();
    expect(logo.getAttribute('alt')).toBe('marcOS');
  });

  it('should render the progress bar', () => {
    const bar: HTMLElement = fixture.nativeElement.querySelector('.splash-bar-fill');
    expect(bar).toBeTruthy();
  });

  it('should start exiting after 2700ms', () => {
    expect(component.exiting()).toBe(false);
    vi.advanceTimersByTime(2700);
    expect(component.exiting()).toBe(true);
  });

  it('should hide completely 500ms after exit starts', () => {
    vi.advanceTimersByTime(2700);
    expect(component.visible()).toBe(true);
    vi.advanceTimersByTime(500);
    expect(component.visible()).toBe(false);
  });

  it('should remove overlay from DOM when no longer visible', () => {
    vi.advanceTimersByTime(3200);
    fixture.detectChanges();
    const overlay: HTMLElement | null = fixture.nativeElement.querySelector('.splash-overlay');
    expect(overlay).toBeFalsy();
  });
});

describe('SplashScreenComponent — post-reboot skip', () => {
  let fixture: ComponentFixture<SplashScreenComponent>;
  let component: SplashScreenComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    sessionStorage.setItem('marcOS_skipSplash', '1');

    await TestBed.configureTestingModule({
      imports: [SplashScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SplashScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.removeItem('marcOS_skipSplash');
  });

  it('should be invisible immediately when the skip flag is present', () => {
    expect(component.visible()).toBe(false);
  });

  it('should remove the sessionStorage flag after consuming it', () => {
    expect(sessionStorage.getItem('marcOS_skipSplash')).toBeNull();
  });

  it('should not render the splash overlay when skip flag is present', () => {
    const overlay = fixture.nativeElement.querySelector('.splash-overlay');
    expect(overlay).toBeFalsy();
  });

  it('should not start the exit timer when skip flag was present', () => {
    expect(component.exiting()).toBe(false);
    vi.advanceTimersByTime(3200);
    // visible stays false — no timers should have been scheduled
    expect(component.visible()).toBe(false);
    expect(component.exiting()).toBe(false);
  });
});
