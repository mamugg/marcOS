import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { SkillsDialogComponent } from './skills-dialog.component';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';

describe('SkillsDialogComponent', () => {
  let component: SkillsDialogComponent;

  const mockDisplaySkills = signal(false);

  const dockStateMock = {
    displaySkills: mockDisplaySkills,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        StorageService,
        {
          provide: TranslateService,
          useValue: { instant: (k: string) => k, onLangChange: EMPTY, use: vi.fn() }
        }
      ]
    })
      .overrideComponent(SkillsDialogComponent, { set: { imports: [], template: '' } })
      .compileComponents();

    const fixture = TestBed.createComponent(SkillsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible by default', () => {
    expect(mockDisplaySkills()).toBe(false);
  });

  it('should become visible when signal is set to true', () => {
    mockDisplaySkills.set(true);
    expect(mockDisplaySkills()).toBe(true);
  });

  it('should expose three skill categories', () => {
    expect(component.categories.length).toBe(3);
  });

  it('should have at least one skill per category', () => {
    component.categories.forEach(cat => {
      expect(cat.skills.length).toBeGreaterThan(0);
    });
  });

  it('should have skill levels between 0 and 100', () => {
    component.categories.forEach(cat => {
      cat.skills.forEach(skill => {
        expect(skill.level).toBeGreaterThanOrEqual(0);
        expect(skill.level).toBeLessThanOrEqual(100);
      });
    });
  });

  it('should have a labelKey and icon for each category', () => {
    component.categories.forEach(cat => {
      expect(cat.labelKey).toBeTruthy();
      expect(cat.icon).toBeTruthy();
    });
  });

  it('should have unique skill names within each category', () => {
    component.categories.forEach(cat => {
      const names = cat.skills.map(s => s.name);
      const unique = new Set(names);
      expect(unique.size).toBe(names.length);
    });
  });
});
