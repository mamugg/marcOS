import { vi } from 'vitest';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Mock localStorage for tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Mock localStorage as a getter/setter to work with jsdom
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Initialize localStorage mock behavior
beforeEach(() => {
  const store: Record<string, string> = {};

  localStorageMock.getItem.mockImplementation((key: string) => store[key] || null);
  localStorageMock.setItem.mockImplementation((key: string, value: string) => {
    store[key] = value.toString();
  });
  localStorageMock.removeItem.mockImplementation((key: string) => {
    delete store[key];
  });
  localStorageMock.clear.mockImplementation(() => {
    Object.keys(store).forEach(key => delete store[key]);
  });
  localStorageMock.key.mockImplementation((index: number) => Object.keys(store)[index] || null);

  // Mock length property
  Object.defineProperty(localStorageMock, 'length', {
    get: () => Object.keys(store).length,
    configurable: true
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
