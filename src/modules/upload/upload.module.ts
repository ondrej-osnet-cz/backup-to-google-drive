import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { SettingsModule } from '../settings/settings.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [SettingsModule, LoggerModule],
  providers: [UploadService],
})
export class UploadModule {}
