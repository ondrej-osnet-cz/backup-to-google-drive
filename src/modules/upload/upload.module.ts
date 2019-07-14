import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { SettingsModule } from '../settings/settings.module';
import { LoggerModule } from '../logger/logger.module';
import { CompressModule } from '../compress/compress.module';

@Module({
  imports: [SettingsModule, LoggerModule, CompressModule],
  providers: [UploadService],
})
export class UploadModule {}
