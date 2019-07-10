import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CompressService } from './modules/compress/compress.service';
import * as readline from 'readline';
import * as fs from 'fs';
import { CommandLineService } from './modules/commandline/commandline.service';
import { GoogleAuthService } from './modules/google-auth/google-auth.service';

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);

  const googleAuth = app.get(GoogleAuthService);
  const authResp = await googleAuth.getClientAuthUrl();

  const cmd = app.get(CommandLineService);
  const googleCode = await cmd.askForGoogleCode(authResp.user_code, authResp.verification_url); 

  const compressor = app.get(CompressService);
  compressor.compressDirectories();

  
}
bootstrap();
