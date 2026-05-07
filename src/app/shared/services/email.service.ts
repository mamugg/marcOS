import { Injectable } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

/** EmailJS credentials — configure at https://dashboard.emailjs.com */
const EMAILJS_SERVICE_ID = 'service_pktre2o';
const EMAILJS_TEMPLATE_ID = 'template_ssq2v48';
const EMAILJS_PUBLIC_KEY = '_DiqO78C5p5J2Xfzx';

export interface EmailPayload {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  /**
   * Send an email via EmailJS to Marc-Antoine.
   * Template must expose variables: from_name, from_email, subject, message.
   */
  send(payload: EmailPayload): Promise<EmailJSResponseStatus> {
    return emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: payload.from_name,
        from_email: payload.from_email,
        subject: payload.subject,
        message: payload.message,
      },
      { publicKey: EMAILJS_PUBLIC_KEY },
    );
  }
}
