import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CompressService } from './modules/compress/compress.service';
import { GoogleAuthService } from './modules/google-auth/google-auth.service';
import { SettingsService } from './modules/settings/settings.service';
import { LoggerService } from './modules/logger/logger.service';
import { UploadService } from './modules/upload/upload.service';

async function bootstrap() {
  // create app DI container
  const app = await NestFactory.create(AppModule);

  // get SettingsService from DI container
  const setting = app.get(SettingsService);

  // if permissions to Google Drive has not yet been set, ask for setup it.
  if (!setting.isGoogleTokensSetup()) {
    // get GoogleAuthService from DI container
    const googleAuth = app.get(GoogleAuthService);
    try {
      // ask for Google Drive permissions and get tokens or fail
      const authResp = await googleAuth.authenticateGoogleDrivePermision();
      // save Google tokens
      setting.saveGoogleTokens(authResp);
      // reload settings - Google tokens include
      setting.reloadSettings();
    } catch (err) {
      // ask for Google Drive permissions failed
      // get logger from DI container
      const logger = app.get(LoggerService);
      // show error
      logger.error(err);
      // end
      return;
    }
  }

  // get CompressService from DI container
  const compressor = app.get(CompressService);
  // compress all directories in source directories
  await compressor.compressDirectories();

  // get UploadService from DI container
  const uploader = app.get(UploadService);
  // upload all compressed files to Google Drive
  await uploader.uploadAllFilesToGogole();
}
bootstrap();
