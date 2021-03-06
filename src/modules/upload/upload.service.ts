import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { google, drive_v3 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { CompressorBase } from '../compress/compress.service';

@Injectable()
export class UploadService {

  constructor(private settings: SettingsService, private log: LoggerService, private compress: CompressorBase) {
  }

  async uploadAllFilesToGogole() {
    this.log.log('Uploadong files to Google Drive');
    const client = await this.getGoogleClient();
    const drive = google.drive({version: 'v3', auth: client});

    let rootBackupFolder = await this.getFolder(drive, this.settings.getTargetFolderName());
    if (!rootBackupFolder) {
      this.log.log(`Folder ${this.settings.getTargetFolderName()} does not exist. Creating new one.`);
      rootBackupFolder = await this.createFolder(drive, this.settings.getTargetFolderName());
    }

    const files = fs.readdirSync(this.settings.getTempCompressFilesFolder());
    for (const file of files) {
      this.log.log(`Uploading file ${file}`);
      const folderName = file.substr(0, file.length - (this.compress.getSuffix().length + 1)); // .7z = 3, .tar.gz2 = 8
      let folder = await this.getFolder(drive, folderName, rootBackupFolder.id);
      if (!folder) {
        this.log.log(`Folder ${this.settings.getTargetFolderName()}/${folderName} does not exist. Creating new one.`);
        folder = await this.createFolder(drive, folderName, rootBackupFolder.id);
      }
      const sourcePath = path.join(this.settings.getTempCompressFilesFolder(), file);
      const now = moment(new Date());
      const fileName = folderName + '_' + now.format('DD_MM_YYYY-hh_mm_ss') + '.' + this.compress.getSuffix();
      this.log.log(`Uploading file ${fileName}`);
      await this.uploadFile(drive, sourcePath, folder.id, fileName);
      this.log.log(`File is uploaded ${fileName}`);
    }
    this.log.log('files uploaded successfully');
  }

  async createFolder(drive: drive_v3.Drive, folderName: string, parentId?: string) {
    const fileMetadata: drive_v3.Schema$File = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : [],
    };
    const createdFile = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name',
    });

    return createdFile.data;
  }

  async uploadFile(drive: drive_v3.Drive, sourcePathToFile: string, targetFolderId: string, targetFileName: string) {
    const fileMetadata: drive_v3.Schema$File = {
      name: targetFileName,
      mimeType: 'application/x-7z-compressed',
      parents: [targetFolderId],
    };
    const media = {
      resumable: true,
      body: fs.createReadStream(sourcePathToFile),
    };
    const createdFile = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name',
    });
    return createdFile.data;
  }

  async getFolder(drive: drive_v3.Drive, folderName: string, parentId?: string) {
    const parenstParam = parentId || 'root';
    const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parenstParam}' in parents and trashed=false`;
    const folder = await drive.files.list({q: query, spaces: 'drive', fields: 'files(id, name)'});
    if (folder.data.files.length > 0) {
      return folder.data.files[0];
    }
    return null;
  }

  async getGoogleClient() {
    const googleData = this.settings.getGoogleAppIdsData().installed;
    const client = new google.auth.OAuth2(googleData.client_id, googleData.client_secret, googleData.redirect_uris[0]);
    const googleTokens = this.settings.getGoogleTokens();

    client.setCredentials({
      access_token: googleTokens.access_token,
      refresh_token: googleTokens.refresh_token,
      token_type: googleTokens.token_type,
      expiry_date: googleTokens.expires_in,
    });
    return client;
  }

}
