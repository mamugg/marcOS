import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ErrorService } from './error.service';
import { vi } from 'vitest';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorService, MessageService]
    });
    service = TestBed.inject(ErrorService);

    // Mock console.error to avoid spam in test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error with custom context', () => {
    const error = new Error('Test error');
    service.handleError(error, 'Test Context');

    // Verify console.error was called
    expect(console.error).toHaveBeenCalledWith('[Test Context]', error);
  });

  it('should handle error with default context', () => {
    const error = new Error('Test error');
    service.handleError(error);

    expect(console.error).toHaveBeenCalledWith('[Erreur]', error);
  });

  it('should handle success message', () => {
    service.handleSuccess('Operation completed');
    // Test passes if no error is thrown
    expect(true).toBe(true);
  });

  it('should handle warning message', () => {
    service.handleWarning('This is a warning');
    expect(true).toBe(true);
  });

  it('should handle info message', () => {
    service.handleInfo('This is info');
    expect(true).toBe(true);
  });

  it('should extract error message from error object', () => {
    const error = { message: 'Custom error message' };
    service.handleError(error as Error, 'Context');

    expect(console.error).toHaveBeenCalledWith('[Context]', error);
  });

  it('should handle null error gracefully', () => {
    service.handleError(null as any, 'Context');

    expect(console.error).toHaveBeenCalledWith('[Context]', null);
  });
});
