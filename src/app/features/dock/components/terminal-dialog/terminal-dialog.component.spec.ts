import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Subject, EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TerminalDialogComponent } from './terminal-dialog.component';
import { TerminalService } from 'primeng/terminal';
import { DockStateService } from '@features/dock/services/dock-state.service';
import { Router } from '@angular/router';

describe('TerminalDialogComponent', () => {
  let component: TerminalDialogComponent;
  let fixture: any;
  let commandHandlerSubject: Subject<string>;
  let sendResponseCalls: string[];
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    commandHandlerSubject = new Subject<string>();
    sendResponseCalls = [];
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TerminalDialogComponent],
      providers: [
        { provide: DockStateService, useValue: { displayTerminal: signal(false) } },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: { instant: (k: string) => k, onLangChange: EMPTY } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(TerminalDialogComponent, {
        set: {
          imports: [],
          template: '',
          providers: [
            {
              provide: TerminalService,
              useValue: {
                commandHandler: commandHandlerSubject.asObservable(),
                sendResponse: (r: string) => { sendResponseCalls.push(r); }
              }
            }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(TerminalDialogComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (fixture && fixture.destroy) {
      fixture.destroy();
    }
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should send a response for the help command', () => {
    commandHandlerSubject.next('help');
    expect(sendResponseCalls.length).toBe(1);
    expect(sendResponseCalls[0]).toContain('Available commands:');
  });

  it('should send a response for the date command', () => {
    commandHandlerSubject.next('date');
    expect(sendResponseCalls.length).toBe(1);
  });

  it('should return username for the whoami command', () => {
    commandHandlerSubject.next('whoami');
    expect(sendResponseCalls[0]).toContain('marc@marcos-portfolio');
  });

  it('should echo provided text for the echo command', () => {
    commandHandlerSubject.next('echo hello world');
    expect(sendResponseCalls[0]).toContain('hello world');
  });

  it('should greet by name for the greet command', () => {
    commandHandlerSubject.next('greet Alice');
    expect(sendResponseCalls[0]).toContain('Alice');
  });

  it('should send an error message for an unknown command', () => {
    commandHandlerSubject.next('unknowncmd');
    expect(sendResponseCalls[0]).toContain('Unknown command');
  });

  it('should not call sendResponse for the clear command', () => {
    commandHandlerSubject.next('clear');
    expect(sendResponseCalls.length).toBe(0);
  });

  it('should not call sendResponse for an empty command', () => {
    commandHandlerSubject.next('');
    expect(sendResponseCalls.length).toBe(0);
  });

  it('should handle commands case-insensitively', () => {
    commandHandlerSubject.next('HELP');
    expect(sendResponseCalls.length).toBe(1);
  });

  it('should unsubscribe via takeUntilDestroyed when component is destroyed', () => {
    fixture.destroy();
    sendResponseCalls = [];
    commandHandlerSubject.next('help');
    expect(sendResponseCalls.length).toBe(0);
  });

  it('should respond with self-destruct message for sudo command', () => {
    vi.useFakeTimers();
    commandHandlerSubject.next('sudo rm -rf /');
    expect(sendResponseCalls[0]).toContain('self-destruct');
    vi.useRealTimers();
  });

  it('should navigate to /404 after timeout when sudo command is used', () => {
    vi.useFakeTimers();
    commandHandlerSubject.next('sudo rm -rf /');
    vi.advanceTimersByTime(1200);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/404']);
    vi.useRealTimers();
  });
});
