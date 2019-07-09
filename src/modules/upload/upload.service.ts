import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { google } from 'googleapis';

@Injectable()
export class UploadService {
  
  constructor(private settings: SettingsService, private log: LoggerService) {
  }

  async uploadAllFilesTooGogole() {
    const drive = new google.auth.OAuth2({})
  }

}
