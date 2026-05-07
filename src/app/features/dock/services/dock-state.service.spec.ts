import { TestBed } from '@angular/core/testing';
import { DockStateService } from './dock-state.service';
import { StorageService } from '@app/shared/services/storage.service';

describe('DockStateService', () => {
  let service: DockStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DockStateService, StorageService]
    });
    service = TestBed.inject(DockStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize all dialogs as closed', () => {
    expect(service.displayFinder()).toBe(false);
    expect(service.displayTerminal()).toBe(false);
    expect(service.displayGalleria()).toBe(false);
    expect(service.displayProjects()).toBe(false);
    expect(service.displayMail()).toBe(false);
    expect(service.displayAbout()).toBe(false);
    expect(service.displaySettings()).toBe(false);
    expect(service.displayCommandPalette()).toBe(false);
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
    service.toggleMail();
    expect(service.displayMail()).toBe(true);

    service.toggleMail();
    expect(service.displayMail()).toBe(false);
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

    service.setGalleria(false);
    expect(service.displayGalleria()).toBe(false);
  });

  it('should set projects to explicit value', () => {
    service.setProjects(true);
    expect(service.displayProjects()).toBe(true);

    service.setProjects(false);
    expect(service.displayProjects()).toBe(false);
  });

  it('should set contact to explicit value', () => {
    service.setMail(true);
    expect(service.displayMail()).toBe(true);

    service.setMail(false);
    expect(service.displayMail()).toBe(false);
  });

  it('should maintain independent state for each window', () => {
    service.setFinder(true);
    service.setTerminal(true);
    service.setGalleria(false);

    expect(service.displayFinder()).toBe(true);
    expect(service.displayTerminal()).toBe(true);
    expect(service.displayGalleria()).toBe(false);
    expect(service.displayProjects()).toBe(false);
    expect(service.displayMail()).toBe(false);
  });

  it('should toggle about', () => {
    service.toggleAbout();
    expect(service.displayAbout()).toBe(true);

    service.toggleAbout();
    expect(service.displayAbout()).toBe(false);
  });

  it('should set about to explicit value', () => {
    service.setAbout(true);
    expect(service.displayAbout()).toBe(true);

    service.setAbout(false);
    expect(service.displayAbout()).toBe(false);
  });

  it('should toggle command palette', () => {
    service.toggleCommandPalette();
    expect(service.displayCommandPalette()).toBe(true);

    service.toggleCommandPalette();
    expect(service.displayCommandPalette()).toBe(false);
  });

  it('should set command palette to explicit value', () => {
    service.setCommandPalette(true);
    expect(service.displayCommandPalette()).toBe(true);

    service.setCommandPalette(false);
    expect(service.displayCommandPalette()).toBe(false);
  });

  it('should close all windows with closeAll()', () => {
    service.setFinder(true);
    service.setTerminal(true);
    service.setGalleria(true);
    service.setProjects(true);
    service.setMail(true);
    service.setSettings(true);

    service.closeAll();

    expect(service.displayFinder()).toBe(false);
    expect(service.displayTerminal()).toBe(false);
    expect(service.displayGalleria()).toBe(false);
    expect(service.displayProjects()).toBe(false);
    expect(service.displayMail()).toBe(false);
    expect(service.displaySettings()).toBe(false);
  });

  it('should not affect About or CommandPalette with closeAll()', () => {
    service.setAbout(true);
    service.setCommandPalette(true);

    service.closeAll();

    expect(service.displayAbout()).toBe(true);
    expect(service.displayCommandPalette()).toBe(true);
  });

  it('should always start closed regardless of any prior localStorage state', () => {
    // The constructor removes all localStorage keys, so signals should always start as false
    expect(service.displayFinder()).toBe(false);
    expect(service.displayTerminal()).toBe(false);
    expect(service.displayGalleria()).toBe(false);
    expect(service.displayProjects()).toBe(false);
    expect(service.displayMail()).toBe(false);
    expect(service.displayAbout()).toBe(false);
  });

  it('should initialize wallpaper to default CSS background when nothing is stored', () => {
    expect(service.wallpaper()).toBe("url('/wallpaper.png') center/cover no-repeat");
  });

  it('should update wallpaper signal via setWallpaper', () => {
    const gradient = 'linear-gradient(135deg, #000 0%, #fff 100%)';
    service.setWallpaper(gradient);
    expect(service.wallpaper()).toBe(gradient);
  });

  it('should persist wallpaper to localStorage via setWallpaper', () => {
    const storageService = TestBed.inject(StorageService);
    const gradient = 'linear-gradient(135deg, #000 0%, #fff 100%)';
    service.setWallpaper(gradient);
    expect(storageService.get<string>('wallpaper')).toBe(gradient);
  });

  it('should restore a valid CSS wallpaper from localStorage on init', () => {
    const storageService = TestBed.inject(StorageService);
    const gradient = 'linear-gradient(135deg, #0f0c29, #24243e)';
    storageService.set('wallpaper', gradient);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [DockStateService, StorageService] });
    const freshService = TestBed.inject(DockStateService);
    expect(freshService.wallpaper()).toBe(gradient);
  });

  it('should migrate raw URL wallpaper from localStorage to default', () => {
    const storageService = TestBed.inject(StorageService);
    storageService.set('wallpaper', '/wallpaper.png');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [DockStateService, StorageService] });
    const freshService = TestBed.inject(DockStateService);
    expect(freshService.wallpaper()).toBe("url('/wallpaper.png') center/cover no-repeat");
  });

  it('should allow updating wallpaper multiple times', () => {
    service.setWallpaper('linear-gradient(135deg, #000 0%, #111 100%)');
    service.setWallpaper('linear-gradient(135deg, #fff 0%, #eee 100%)');
    expect(service.wallpaper()).toBe('linear-gradient(135deg, #fff 0%, #eee 100%)');
  });
});
