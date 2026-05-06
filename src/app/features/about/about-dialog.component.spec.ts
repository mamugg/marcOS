import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { AboutDialogComponent } from './about-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { signal } from '@angular/core';

describe('AboutDialogComponent', () => {
  let fixture: ComponentFixture<AboutDialogComponent>;
  let component: AboutDialogComponent;
  let dockState: { displayAbout: ReturnType<typeof signal<boolean>>; toggleAbout: () => void };

  beforeEach(async () => {
    dockState = {
      displayAbout: signal(false),
      toggleAbout: () => dockState.displayAbout.update(v => !v)
    };

    await TestBed.configureTestingModule({
      imports: [AboutDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockState }
      ]
    })
      .overrideComponent(AboutDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(AboutDialogComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (fixture?.destroy) fixture.destroy();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should expose dockState', () => {
    expect((component as any).dockState).toBe(dockState);
  });

  it('should expose a non-empty techStack', () => {
    expect(component.techStack.length).toBeGreaterThan(0);
  });

  it('should include Angular in the tech stack', () => {
    const names = component.techStack.map(t => t.name);
    expect(names).toContain('Angular');
  });

  it('should include TypeScript in the tech stack', () => {
    const names = component.techStack.map(t => t.name);
    expect(names).toContain('TypeScript');
  });

  it('should have name, version, and icon for every tech entry', () => {
    component.techStack.forEach(tech => {
      expect(tech.name).toBeTruthy();
      expect(tech.version).toBeTruthy();
      expect(tech.icon).toBeTruthy();
    });
  });
});
