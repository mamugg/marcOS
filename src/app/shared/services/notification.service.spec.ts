import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';
import { NotificationService } from './notification.service';

const DELAY_2MIN = 2 * 60 * 1000;
const DELAY_10MIN = 10 * 60 * 1000;

describe('NotificationService', () => {
  let service: NotificationService;
  let messageService: MessageService;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        MessageService,
        {
          provide: TranslateService,
          useValue: { instant: (key: string) => key }
        }
      ]
    });

    service = TestBed.inject(NotificationService);
    messageService = TestBed.inject(MessageService);
    vi.spyOn(messageService, 'add');
  });

  afterEach(() => {
    service.ngOnDestroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not fire any notification before init', () => {
    vi.advanceTimersByTime(DELAY_10MIN + 1000);
    expect(messageService.add).not.toHaveBeenCalled();
  });

  it('should fire the 2-minute notification after init', () => {
    service.init();
    vi.advanceTimersByTime(DELAY_2MIN);

    expect(messageService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'info',
        key: 'tc',
        summary: 'notification.message.summary',
        detail: 'notification.message.detail'
      })
    );
  });

  it('should fire the 10-minute notification after init', () => {
    service.init();
    vi.advanceTimersByTime(DELAY_10MIN);

    expect(messageService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
        key: 'tc',
        summary: 'notification.explorer.summary',
        detail: 'notification.explorer.detail'
      })
    );
  });

  it('should not initialize twice when init is called multiple times', () => {
    service.init();
    service.init();
    vi.advanceTimersByTime(DELAY_2MIN);

    expect(messageService.add).toHaveBeenCalledTimes(1);
  });

  it('should clear timers on destroy', () => {
    service.init();
    service.ngOnDestroy();

    vi.advanceTimersByTime(DELAY_10MIN);
    expect(messageService.add).not.toHaveBeenCalled();
  });
});
