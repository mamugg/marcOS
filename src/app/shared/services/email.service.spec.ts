import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { EmailService } from './email.service';
import emailjs from '@emailjs/browser';

vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}));

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call emailjs.send with correct payload', async () => {
    const mockResponse = { status: 200, text: 'OK' };
    vi.mocked(emailjs.send).mockResolvedValue(mockResponse as never);

    const payload = {
      from_name: 'John Doe',
      from_email: 'john@example.com',
      subject: 'Hello',
      message: 'Test message',
    };

    const result = await service.send(payload);

    expect(emailjs.send).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        subject: 'Hello',
        message: 'Test message',
      },
      { publicKey: expect.any(String) },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should propagate errors from emailjs.send', async () => {
    const error = new Error('EmailJS error');
    vi.mocked(emailjs.send).mockRejectedValue(error);

    await expect(
      service.send({
        from_name: 'Jane',
        from_email: 'jane@example.com',
        subject: 'Hi',
        message: 'Message',
      }),
    ).rejects.toThrow('EmailJS error');
  });
});
