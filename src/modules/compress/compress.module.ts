import { Module, Logger } from '@nestjs/common';
import { CompressService } from './compress.service';
import { SettingsModule } from '../settings/settings.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [SettingsModule, LoggerModule],
  providers: [CompressService],
})
export class CompressModule {}
