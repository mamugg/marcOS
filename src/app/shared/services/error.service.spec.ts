import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let messageService: MessageService;
  let messageAddCalls: any[] = [];
  let consoleErrorCalls: any[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorService, MessageService]
    });
    service = TestBed.inject(ErrorService);
    messageService = TestBed.inject(MessageService);

    // Reset call tracking
    messageAddCalls = [];
    consoleErrorCalls = [];

    // Mock messageService.add
    const originalAdd = messageService.add;
    messageService.add = function(message: any) {
      messageAddCalls.push(message);
      return originalAdd.call(this, message);
    };

    // Mock console.error
    console.error = function(...args: any[]) {
      consoleErrorCalls.push(args);
      // Don't call original to avoid spam
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle error with custom context', () => {
    const error = new Error('Test error');
    service.handleError(error, 'Test Context');

    expect(consoleErrorCalls.length).toBeGreaterThan(0);
    expect(messageAddCalls.length).toBeGreaterThan(0);
    expect(messageAddCalls[0].severity).toBe('error');
  });

  it('should handle error with default context', () => {
    const error = new Error('Test error');
    service.handleError(error);

    expect(consoleErrorCalls.length).toBeGreaterThan(0);
    expect(messageAddCalls.length).toBeGreaterThan(0);
  });

  it('should handle success message', () => {
    messageAddCalls = [];
    service.handleSuccess('Operation completed');

    expect(messageAddCalls.length).toBeGreaterThan(0);
    expect(messageAddCalls[0].severity).toBe('success');
  });

  it('should handle warning message', () => {
    messageAddCalls = [];
    service.handleWarning('This is a warning');

    expect(messageAddCalls.length).toBeGreaterThan(0);
    expect(messageAddCalls[0].severity).toBe('warn');
  });

  it('should handle info message', () => {
    messageAddCalls = [];
    service.handleInfo('This is info');

    expect(messageAddCalls.length).toBeGreaterThan(0);
    expect(messageAddCalls[0].severity).toBe('info');
  });

  it('should extract error message from error object', () => {
    messageAddCalls = [];
    const error = { message: 'Custom error message' };
    service.handleError(error as Error, 'Context');

    expect(messageAddCalls.length).toBeGreaterThan(0);
    expect(messageAddCalls[0].detail).toContain('Custom error message');
  });

  it('should handle null error gracefully', () => {
    messageAddCalls = [];
    service.handleError(null as any, 'Context');

    expect(messageAddCalls.length).toBeGreaterThan(0);
  });
});


