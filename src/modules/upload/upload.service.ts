import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { google } from 'googleapis';

@Injectable()
export class UploadService {
  
  constructor(private settings: SettingsService, private log: LoggerService) {
  }

  async uploadAllFilesTooGogole() {
    const client = await this.getGoogleClient();
    const drive = google.drive({version: 'v3', auth: client});

    const targetFilesMatch = await drive.files.list({q: `mimeType='application/vnd.google-apps.folder and name='${this.settings.getTargetFolderName()}'`, spaces: 'drive', fields: 'nextPageToken, files(id, name)'});
    if (targetFilesMatch.data.files.length === 0) {
      const createdFile = drive.files.create();
    }
  }

  async getGoogleClient() {
    const googleData = this.settings.getGoogleAppIdsData().installed;
    const client = new google.auth.OAuth2(googleData.client_id, googleData.client_secret, googleData.redirect_uris[0]);
    const googleTokens = this.settings.getGoogleTokens();
    
    client.setCredentials({access_token: googleTokens.access_token, refresh_token: googleTokens.refresh_token, token_type: googleTokens.token_type, expiry_date: googleTokens.expires_in});
    return client;
  }

}
