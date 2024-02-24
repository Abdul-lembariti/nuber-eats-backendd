import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailModuleOption } from './mail.inter';
import { CONFIG_OPTIONS } from 'src/common/common.const';

@Module({})
@Global()
export class MailModule {
  static forRoot(options: MailModuleOption): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
