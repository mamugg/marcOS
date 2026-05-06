import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .overrideComponent(App, { set: { template: '', imports: [] } })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have title signal initialized to marcOS', () => {
    const fixture = TestBed.createComponent(App);
    expect((fixture.componentInstance as any).title()).toBe('marcOS');
  });
});
