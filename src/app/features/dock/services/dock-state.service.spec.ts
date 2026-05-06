import { TestBed } from '@angular/core/testing';
import { DockStateService } from './dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';

describe('DockStateService', () => {
  let service: DockStateService;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DockStateService, StorageService]
    });
    storageService = TestBed.inject(StorageService);
    // Clear localStorage before each test
    storageService.clear();
  });

  afterEach(() => {
    storageService.clear();
  });

  it('should be created', () => {
    service = TestBed.inject(DockStateService);
    expect(service).toBeTruthy();
  });

  it('should initialize with default false values', () => {
    service = TestBed.inject(DockStateService);
    expect(service.displayFinder()).toBe(false);
    expect(service.displayTerminal()).toBe(false);
    expect(service.displayGalleria()).toBe(false);
  });

  it('should toggle finder and persist to localStorage', () => {
    service = TestBed.inject(DockStateService);
    service.toggleFinder();
    expect(service.displayFinder()).toBe(true);
    expect(storageService.get('displayFinder', false)).toBe(true);

    service.toggleFinder();
    expect(service.displayFinder()).toBe(false);
    expect(storageService.get('displayFinder', false)).toBe(false);
  });

  it('should toggle terminal and persist to localStorage', () => {
    service = TestBed.inject(DockStateService);
    service.toggleTerminal();
    expect(service.displayTerminal()).toBe(true);
    expect(storageService.get('displayTerminal', false)).toBe(true);

    service.toggleTerminal();
    expect(service.displayTerminal()).toBe(false);
    expect(storageService.get('displayTerminal', false)).toBe(false);
  });

  it('should toggle galleria and persist to localStorage', () => {
    service = TestBed.inject(DockStateService);
    service.toggleGalleria();
    expect(service.displayGalleria()).toBe(true);
    expect(storageService.get('displayGalleria', false)).toBe(true);

    service.toggleGalleria();
    expect(service.displayGalleria()).toBe(false);
    expect(storageService.get('displayGalleria', false)).toBe(false);
  });

  it('should set finder and persist to localStorage', () => {
    service = TestBed.inject(DockStateService);
    service.setFinder(true);
    expect(service.displayFinder()).toBe(true);
    expect(storageService.get('displayFinder', false)).toBe(true);

    service.setFinder(false);
    expect(service.displayFinder()).toBe(false);
    expect(storageService.get('displayFinder', false)).toBe(false);
  });

  it('should set terminal and persist to localStorage', () => {
    service = TestBed.inject(DockStateService);
    service.setTerminal(true);
    expect(service.displayTerminal()).toBe(true);
    expect(storageService.get('displayTerminal', false)).toBe(true);
  });

  it('should set galleria and persist to localStorage', () => {
    service = TestBed.inject(DockStateService);
    service.setGalleria(true);
    expect(service.displayGalleria()).toBe(true);
    expect(storageService.get('displayGalleria', false)).toBe(true);
  });

  it('should maintain independent state for each window', () => {
    service = TestBed.inject(DockStateService);
    service.setFinder(true);
    service.setTerminal(false);
    service.setGalleria(true);

    expect(service.displayFinder()).toBe(true);
    expect(service.displayTerminal()).toBe(false);
    expect(service.displayGalleria()).toBe(true);
  });

  it('should restore state from localStorage on new instance', () => {
    service = TestBed.inject(DockStateService);
    service.setFinder(true);
    service.setTerminal(true);
    
    // Verify persisted values
    expect(storageService.get('displayFinder', false)).toBe(true);
    expect(storageService.get('displayTerminal', false)).toBe(true);
  });
});


