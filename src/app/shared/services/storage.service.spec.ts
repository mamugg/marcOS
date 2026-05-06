import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get a value', () => {
    service.set('testKey', 'testValue');
    const value = service.get('testKey', 'default');
    expect(value).toBe('testValue');
  });

  it('should return default value if key not found', () => {
    const value = service.get('nonexistent', 'defaultValue');
    expect(value).toBe('defaultValue');
  });

  it('should set and get objects', () => {
    const testObject = { name: 'Marc', role: 'Developer' };
    service.set('user', testObject);
    const retrieved = service.get('user', {});
    expect(retrieved).toEqual(testObject);
  });

  it('should return null if key not found and no default', () => {
    const value = service.get('nonexistent');
    expect(value).toBeNull();
  });

  it('should remove a key', () => {
    service.set('tempKey', 'tempValue');
    service.remove('tempKey');
    const value = service.get('tempKey', null);
    expect(value).toBeNull();
  });

  it('should use prefix for all keys', () => {
    service.set('key1', 'value1');
    const keys = Object.keys(localStorage);
    const hasPrefix = keys.some(key => key.startsWith('marcOS_'));
    expect(hasPrefix).toBe(true);
  });

  it('should clear all keys with prefix', () => {
    service.set('key1', 'value1');
    service.set('key2', 'value2');
    service.clear();
    expect(localStorage.length).toBe(0);
  });

  it('should get all keys without prefix', () => {
    service.set('key1', 'value1');
    service.set('key2', 'value2');
    const keys = service.getAllKeys();
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
    expect(keys.length).toBe(2);
  });

  it('should handle JSON parse errors gracefully', () => {
    localStorage.setItem('marcOS_badJson', '{invalid json}');
    const value = service.get('badJson', 'default');
    expect(value).toBe('default');
  });

  it('should handle boolean values correctly', () => {
    service.set('boolTrue', true);
    service.set('boolFalse', false);
    
    expect(service.get('boolTrue', false)).toBe(true);
    expect(service.get('boolFalse', true)).toBe(false);
  });

  it('should handle numeric values correctly', () => {
    service.set('number', 42);
    const value = service.get('number', 0);
    expect(value).toBe(42);
  });
});
