import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DesktopIconComponent } from './desktop-icon.component';

describe('DesktopIconComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopIconComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(DesktopIconComponent, { set: { template: '', imports: [] } })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should default label to empty string', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    expect(fixture.componentInstance.label()).toBe('');
  });

  it('should default docType to txt', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    expect(fixture.componentInstance.docType()).toBe('txt');
  });

  it('should start with selected false', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance['selected']()).toBe(false);
  });

  it('should set selected on first click (single)', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.onClick();
    expect(component['selected']()).toBe(true);
  });

  it('should emit opened on two rapid clicks', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    const component = fixture.componentInstance;
    const openedSpy = vi.fn();
    const sub = component.opened.subscribe(openedSpy);
    fixture.detectChanges();

    component.onClick();
    component.onClick();

    expect(openedSpy).toHaveBeenCalledTimes(1);
    sub.unsubscribe();
  });

  it('should emit opened on Enter key', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    const component = fixture.componentInstance;
    const openedSpy = vi.fn();
    const sub = component.opened.subscribe(openedSpy);
    fixture.detectChanges();

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(openedSpy).toHaveBeenCalledTimes(1);
    sub.unsubscribe();
  });

  it('should emit opened on Space key', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    const component = fixture.componentInstance;
    const openedSpy = vi.fn();
    const sub = component.opened.subscribe(openedSpy);
    fixture.detectChanges();

    component.onKeyDown(new KeyboardEvent('keydown', { key: ' ' }));
    expect(openedSpy).toHaveBeenCalledTimes(1);
    sub.unsubscribe();
  });

  it('should not emit opened on non-action keys', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    const component = fixture.componentInstance;
    const openedSpy = vi.fn();
    const sub = component.opened.subscribe(openedSpy);
    fixture.detectChanges();

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(openedSpy).not.toHaveBeenCalled();
    sub.unsubscribe();
  });

  it('should clear selected on Escape key', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.onClick();
    expect(component['selected']()).toBe(true);

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component['selected']()).toBe(false);
  });

  it('should clear selected on blur', () => {
    const fixture = TestBed.createComponent(DesktopIconComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.onClick();
    component.onBlur();
    expect(component['selected']()).toBe(false);
  });
});
