import { TestBed } from '@angular/core/testing';
import { DockStateService } from './dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';

describe('DockStateService', () => {
  let service: DockStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DockStateService, StorageService]
    });
    localStorage.clear();
    service = TestBed.inject(DockStateService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize all dialogs as closed', () => {
    expect(service.displayFinder()).toBe(false);
    expect(service.displayTerminal()).toBe(false);
    expect(service.displayGalleria()).toBe(false);
    expect(service.displayProjects()).toBe(false);
    expect(service.displayContact()).toBe(false);
  });

  it('should toggle finder', () => {
    service.toggleFinder();
    expect(service.displayFinder()).toBe(true);

    service.toggleFinder();
    expect(service.displayFinder()).toBe(false);
  });

  it('should toggle terminal', () => {
    service.toggleTerminal();
    expect(service.displayTerminal()).toBe(true);

    service.toggleTerminal();
    expect(service.displayTerminal()).toBe(false);
  });

  it('should toggle galleria', () => {
    service.toggleGalleria();
    expect(service.displayGalleria()).toBe(true);

    service.toggleGalleria();
    expect(service.displayGalleria()).toBe(false);
  });

  it('should toggle projects', () => {
    service.toggleProjects();
    expect(service.displayProjects()).toBe(true);

    service.toggleProjects();
    expect(service.displayProjects()).toBe(false);
  });

  it('should toggle contact', () => {
    service.toggleContact();
    expect(service.displayContact()).toBe(true);

    service.toggleContact();
    expect(service.displayContact()).toBe(false);
  });

  it('should set finder to explicit value', () => {
    service.setFinder(true);
    expect(service.displayFinder()).toBe(true);

    service.setFinder(false);
    expect(service.displayFinder()).toBe(false);
  });

  it('should set terminal to explicit value', () => {
    service.setTerminal(true);
    expect(service.displayTerminal()).toBe(true);

    service.setTerminal(false);
    expect(service.displayTerminal()).toBe(false);
  });

  it('should set galleria to explicit value', () => {
    service.setGalleria(true);
    expect(service.displayGalleria()).toBe(true);
  });

  it('should set projects to explicit value', () => {
    service.setProjects(true);
    expect(service.displayProjects()).toBe(true);
  });

  it('should set contact to explicit value', () => {
    service.setContact(true);
    expect(service.displayContact()).toBe(true);
  });

  it('should maintain independent state for each window', () => {
    service.setFinder(true);
    service.setTerminal(false);
    service.setProjects(true);

    expect(service.displayFinder()).toBe(true);
    expect(service.displayTerminal()).toBe(false);
    expect(service.displayProjects()).toBe(true);
  });

  it('should always start closed regardless of any prior localStorage state', () => {
    localStorage.setItem('marcOS_displayFinder', 'true');
    localStorage.setItem('marcOS_displayTerminal', 'true');

    const freshService = TestBed.inject(DockStateService);
    expect(freshService.displayFinder()).toBe(false);
    expect(freshService.displayTerminal()).toBe(false);
  });
});
