import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'markkucher100@gmail.com',
          pass: 'xqfoeawoibwfqqqa',
        },
      },
    }),
  ],
  providers: [SendMailService],
  exports: [SendMailService], // 👈 export for DI
})
export class MailModule {}
