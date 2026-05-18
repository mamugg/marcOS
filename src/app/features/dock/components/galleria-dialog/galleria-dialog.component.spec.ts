import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GalleriaDialogComponent } from './galleria-dialog.component';
import { PhotoService } from '@app/shared/services/photo.service';
import { ErrorService } from '@app/shared/services/error.service';
import { DockStateService } from '@features/dock/services/dock-state.service';

describe('GalleriaDialogComponent', () => {
  let component: GalleriaDialogComponent;
  let photoServiceMock: { getImages: () => Promise<{ itemImageSrc: string; thumbnailImageSrc: string; alt: string; title: string }[]> };
  let errorServiceMock: { handleError: (...args: unknown[]) => void; handleWarning: (...args: unknown[]) => void };
  let dockStateMock: { displayGalleria: ReturnType<typeof signal<boolean>>; wallpaper: ReturnType<typeof signal<string>>; setGalleria: (v: boolean) => void; setWallpaper: (url: string) => void };

  const mockImages = [
    { itemImageSrc: 'img1.jpg', thumbnailImageSrc: 'thumb1.jpg', alt: 'Alt 1', title: 'Title 1' },
    { itemImageSrc: 'img2.jpg', thumbnailImageSrc: 'thumb2.jpg', alt: 'Alt 2', title: 'Title 2' }
  ];

  beforeEach(async () => {
    photoServiceMock = { getImages: () => Promise.resolve(mockImages) };
    errorServiceMock = { handleError: () => {}, handleWarning: () => {} };
    dockStateMock = {
      displayGalleria: signal(false),
      wallpaper: signal('/wallpaper.png'),
      setGalleria: (v: boolean) => dockStateMock.displayGalleria.set(v),
      setWallpaper: (url: string) => dockStateMock.wallpaper.set(url)
    };

    await TestBed.configureTestingModule({
      imports: [GalleriaDialogComponent],
      providers: [
        { provide: DockStateService, useValue: dockStateMock },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: TranslateService, useValue: { instant: (k: string) => k } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(GalleriaDialogComponent, {
        set: {
          providers: [{ provide: PhotoService, useValue: photoServiceMock }],
          template: ''
        }
      })
      .compileComponents();

    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should start with isLoading true, images empty and no selection', () => {
    expect(component.isLoading()).toBe(true);
    expect(component.images()).toEqual([]);
    expect(component.selectedIndex()).toBeNull();
  });

  it('should populate images and set isLoading false on successful load', async () => {
    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.images()).toEqual(mockImages);
    expect(component.isLoading()).toBe(false);
  });

  it('should call handleWarning and set isLoading false when images array is empty', async () => {
    photoServiceMock.getImages = () => Promise.resolve([]);
    let warnCalled = false;
    errorServiceMock.handleWarning = () => { warnCalled = true; };

    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(warnCalled).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('should call handleError and set isLoading false when getImages rejects', async () => {
    photoServiceMock.getImages = () => Promise.reject(new Error('load error'));
    let errorCalled = false;
    errorServiceMock.handleError = () => { errorCalled = true; };

    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(errorCalled).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('should set selectedIndex when openPhoto is called', async () => {
    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.openPhoto(1);
    expect(component.selectedIndex()).toBe(1);
  });

  it('should reset selectedIndex when closePhoto is called', async () => {
    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.openPhoto(0);
    component.closePhoto();
    expect(component.selectedIndex()).toBeNull();
  });

  it('should navigate to next photo circularly', async () => {
    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.openPhoto(1);
    component.nextPhoto();
    expect(component.selectedIndex()).toBe(0);
  });

  it('should navigate to prev photo circularly', async () => {
    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.openPhoto(0);
    component.prevPhoto();
    expect(component.selectedIndex()).toBe(1);
  });

  it('should expose the selected photo via computed selectedPhoto', async () => {
    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.openPhoto(0);
    expect(component.selectedPhoto()).toEqual(mockImages[0]);
  });

  it('should return null for selectedPhoto when no selection', () => {
    expect(component.selectedPhoto()).toBeNull();
  });

  it('should call dockState.setWallpaper with the selected photo src', async () => {
    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.openPhoto(0);
    component.setWallpaper();
    expect(dockStateMock.wallpaper()).toBe("url('img1.jpg') center/cover no-repeat");
  });

  it('should not call setWallpaper when no photo is selected', () => {
    const spy = vi.spyOn(dockStateMock, 'setWallpaper');
    component.setWallpaper();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should close lightbox on ESC when a photo is selected', async () => {
    const fixture = TestBed.createComponent(GalleriaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    component.openPhoto(0);
    component.onEscape();
    expect(component.selectedIndex()).toBeNull();
    expect(dockStateMock.displayGalleria()).toBe(false === false ? false : false);
  });

  it('should close the dialog on ESC when no photo is selected', () => {
    component.onEscape();
    expect(dockStateMock.displayGalleria()).toBe(false);
  });
});
