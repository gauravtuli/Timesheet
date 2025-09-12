declare module 'nodemailer' {
  export interface SendMailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }

  export interface SentMessageInfo {
    accepted: string[];
    rejected: string[];
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: { from: string; to: string[] };
    mailOptions: SendMailOptions;
  }

  export function createTransport(options: any): Transporter;
  
  export interface Transporter {
    sendMail(mailOptions: SendMailOptions): Promise<SentMessageInfo>;
  }
}
