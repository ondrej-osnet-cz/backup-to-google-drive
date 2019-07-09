import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  providers: [UploadService],
})
export class UploadModule {}
