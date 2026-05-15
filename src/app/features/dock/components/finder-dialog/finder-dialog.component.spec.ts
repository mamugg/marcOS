import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FinderDialogComponent } from './finder-dialog.component';
import { NodeService } from '@app/shared/services/node.service';
import { ErrorService } from '@app/shared/services/error.service';
import { DockStateService } from '@features/dock/services/dock-state.service';

describe('FinderDialogComponent', () => {
  let component: FinderDialogComponent;
  let nodeServiceMock: { getFiles: () => Promise<any[]> };
  let errorServiceMock: { handleError: (...args: any[]) => void; handleWarning: (...args: any[]) => void };

  const mockNodes = [{ key: '0', label: 'Documents', children: [] }];

  beforeEach(async () => {
    nodeServiceMock = { getFiles: () => Promise.resolve(mockNodes) };
    errorServiceMock = { handleError: () => {}, handleWarning: () => {} };

    await TestBed.configureTestingModule({
      imports: [FinderDialogComponent],
      providers: [
        { provide: DockStateService, useValue: { displayFinder: signal(false) } },
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: TranslateService, useValue: { instant: (k: string) => k } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(FinderDialogComponent, {
        set: {
          providers: [{ provide: NodeService, useValue: nodeServiceMock }],
          template: ''
        }
      })
      .compileComponents();

    const fixture = TestBed.createComponent(FinderDialogComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should start with isLoading true and nodes empty', () => {
    expect(component.isLoading()).toBe(true);
    expect(component.nodes()).toEqual([]);
  });

  it('should populate nodes and set isLoading false on successful load', async () => {
    const fixture = TestBed.createComponent(FinderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.nodes()).toEqual(mockNodes);
    expect(component.isLoading()).toBe(false);
  });

  it('should call handleWarning and set isLoading false when nodes array is empty', async () => {
    nodeServiceMock.getFiles = () => Promise.resolve([]);
    let warnCalled = false;
    errorServiceMock.handleWarning = () => { warnCalled = true; };

    const fixture = TestBed.createComponent(FinderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(warnCalled).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('should call handleError and set isLoading false when getFiles rejects', async () => {
    nodeServiceMock.getFiles = () => Promise.reject(new Error('network error'));
    let errorCalled = false;
    errorServiceMock.handleError = () => { errorCalled = true; };

    const fixture = TestBed.createComponent(FinderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(errorCalled).toBe(true);
    expect(component.isLoading()).toBe(false);
  });
});
