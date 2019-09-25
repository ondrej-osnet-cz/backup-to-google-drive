import { Module, HttpModule } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { SettingsModule } from '../settings/settings.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [ HttpModule, SettingsModule, LoggerModule ],
  providers: [ GoogleAuthService ],
  exports: [ GoogleAuthService ],
})
export class GoogleAuthModule {}
