import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CompressService } from './modules/compress/compress.service';
import { GoogleAuthService } from './modules/google-auth/google-auth.service';
import { SettingsService } from './modules/settings/settings.service';
import { LoggerService } from './modules/logger/logger.service';
import { UploadService } from './modules/upload/upload.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const setting = app.get(SettingsService);

  if (!setting.isGoogleTokensSetup()) {
    const googleAuth = app.get(GoogleAuthService);
    try {
      const authResp = await googleAuth.getClientAuthUrl();
      setting.saveGoogleTokens(authResp);
      setting.reloadSettings();
    } catch (err) {
      const logger = app.get(LoggerService);
      logger.error(err);
      return;
    }
  }

  const compressor = app.get(CompressService);
  await compressor.compressDirectories();

  const uploader = app.get(UploadService);
  await uploader.uploadAllFilesToGogole();
}
bootstrap();
