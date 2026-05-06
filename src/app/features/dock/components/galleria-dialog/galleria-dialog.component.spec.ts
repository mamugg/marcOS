import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { GalleriaDialogComponent } from './galleria-dialog.component';
import { PhotoService } from '@app/shared/services/photo.service';
import { ErrorService } from '@app/shared/services/error.service';
import { DockStateService } from '@features/dock/services/dock-state.service';

describe('GalleriaDialogComponent', () => {
  let component: GalleriaDialogComponent;
  let photoServiceMock: { getImages: () => Promise<any[]> };
  let errorServiceMock: { handleError: (...args: any[]) => void; handleWarning: (...args: any[]) => void };

  const mockImages = [
    { itemImageSrc: 'img1.jpg', thumbnailImageSrc: 'thumb1.jpg', alt: 'Alt 1', title: 'Title 1' }
  ];

  beforeEach(async () => {
    photoServiceMock = { getImages: () => Promise.resolve(mockImages) };
    errorServiceMock = { handleError: () => {}, handleWarning: () => {} };

    await TestBed.configureTestingModule({
      imports: [GalleriaDialogComponent],
      providers: [
        { provide: DockStateService, useValue: { displayGalleria: signal(false) } },
        { provide: ErrorService, useValue: errorServiceMock }
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

  it('should start with isLoading true and images empty', () => {
    expect(component.isLoading()).toBe(true);
    expect(component.images()).toEqual([]);
  });

  it('should initialize responsiveOptions signal with breakpoint entries', () => {
    expect(component.responsiveOptions().length).toBeGreaterThan(0);
    expect(component.responsiveOptions()[0]).toHaveProperty('breakpoint');
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
});
