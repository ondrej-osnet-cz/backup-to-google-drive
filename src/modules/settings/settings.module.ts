import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Module({
  imports: [],
  providers: [
    {
      provide: SettingsService,
      useValue: new SettingsService('app.config.json'),
    }
  ],
  exports: [SettingsService]
})
export class SettingsModule {}
