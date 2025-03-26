import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendConfirmMail(to, link): void {
    this.mailerService
      .sendMail({
        to,
        from: 'music-platform@outlook.com',
        subject: 'Account activation',
        text: '',
        html: `
                    <div>
                        <h1>Tap link to activate account in music-platform</h1>
                        <a href="${link}">${link}</a>
                        <p>If you did not request this email you can safely ignore it.</p>
                    </div>
                `,
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  public forgotPasswordMail(to, link): void {
    this.mailerService
      .sendMail({
        to,
        from: 'music-platform@outlook.com',
        subject: 'Tap on link to change password',
        text: '',
        html: `
                    <div>
                        <h1>Tap link to activate</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
      })
      .catch((e) => {
        console.log(e.message);
      });
  }
}
