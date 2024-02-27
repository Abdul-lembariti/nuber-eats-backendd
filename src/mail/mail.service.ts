import got from 'got';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.const';
import { MailModuleOption, MailVar } from './mail.inter';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOption,
  ) {}

  async sendEmail(
    subject: string,
    template: string,
    mailVars: MailVar[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append(
      'from',
      `Nahul from Nuber Eats <mailgun@${this.options.domain}>`,
    );
    // due to no payment
    form.append('to', `abdullembariti2005@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    mailVars.forEach((eVar) => form.append(eVar.key, eVar.value));
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (err) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'nuber eats', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}

/* NODE METHOD  // const mailgun = new Mailgun(FormData);
    // const mg = mailgun.client({
    //   username: 'api',
    //   key: this.options.apiKey,
    // });

    // mg.messages
    //   .create(this.options.domain, {
    //     from: 'Excited User <mailgun@sandbox841dec421a7a4acda9d765a568c248a4.mailgun.orgsandbox-123.mailgun.org>',
    //     to: ['abdullembariti2005@gmail.com'],
    //     subject: 'Hello',
    //     text: 'Testing some Mailgun awesomeness!',
    //     html: '<h1>Testing some Mailgun awesomeness!</h1>',
    //   })
    //   .then((msg) => console.log(msg)) 
    //   .catch((err) => console.log(err)); */
