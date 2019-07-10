import { Module } from '@nestjs/common';
import { UploadModule } from './modules/upload/upload.module';
import { CompressModule } from './modules/compress/compress.module';
import { CommandLineModule } from './modules/commandline/commandline.module';
import { GoogleAuthModule } from './modules/google-auth/google-auth.module';

@Module({
  imports: [CompressModule, UploadModule, CommandLineModule, GoogleAuthModule],
})
export class AppModule {}
