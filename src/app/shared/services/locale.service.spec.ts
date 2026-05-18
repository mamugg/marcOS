import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from './locale.service';
import { StorageService } from './storage.service';

describe('LocaleService', () => {
  let service: LocaleService;
  let translateMock: { use: ReturnType<typeof vi.fn>; onLangChange: typeof EMPTY };

  beforeEach(() => {
    translateMock = { use: vi.fn(), onLangChange: EMPTY };

    TestBed.configureTestingModule({
      providers: [
        LocaleService,
        StorageService,
        { provide: TranslateService, useValue: translateMock }
      ]
    });
    service = TestBed.inject(LocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default locale to "fr"', () => {
    expect(service.locale()).toBe('fr');
  });

  it('setLocale("en") updates the locale signal', () => {
    service.setLocale('en');
    expect(service.locale()).toBe('en');
  });

  it('setLocale("en") persists to storage', () => {
    const storage = TestBed.inject(StorageService);
    service.setLocale('en');
    expect(storage.get<string>('locale')).toBe('en');
  });

  it('setLocale("en") calls translate.use("en")', () => {
    service.setLocale('en');
    expect(translateMock.use).toHaveBeenCalledWith('en');
  });

  it('setLocale("fr") reverts locale back to fr', () => {
    service.setLocale('en');
    service.setLocale('fr');
    expect(service.locale()).toBe('fr');
  });

  it('setLocale("fr") calls translate.use("fr")', () => {
    service.setLocale('fr');
    expect(translateMock.use).toHaveBeenCalledWith('fr');
  });

  it('should restore locale from storage on init', () => {
    const storage = TestBed.inject(StorageService);
    storage.set('locale', 'en');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        LocaleService,
        StorageService,
        { provide: TranslateService, useValue: translateMock }
      ]
    });
    const freshService = TestBed.inject(LocaleService);
    expect(freshService.locale()).toBe('en');
  });
});
