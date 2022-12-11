import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import * as mjml2html from 'mjml';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  sendMail(to: string, subject: string, text: string, url: string) {
    this.logger.debug(`Sending email to: ${to}`);
    const mjmlFile = readFileSync(
      `${process.cwd()}/templates/listener-updated.mjml`,
      { encoding: 'utf8' },
    );

    const htmlString = mjml2html(mjmlFile);

    return this.mailerService.sendMail({
      to: to,
      subject: subject,
      cc: 'email@hotmail.com',
      template: null,
      context: null,
      html: compile(htmlString.html)({
        content: text,
        url: url,
      }),
    });
  }
}
