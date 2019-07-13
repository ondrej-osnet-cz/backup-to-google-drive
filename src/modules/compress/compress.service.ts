import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as child_process from 'child_process';

@Injectable()
export class CompressService {

  constructor(private settings: SettingsService, private log: LoggerService) {
  }

  async compressDirectories() {
    this.log.log('Compression started.');
    this.log.log(`Compress all in ${this.settings.getSourceFolder()}`);
    const allFiles = fs.readdirSync(this.settings.getSourceFolder());
    this.log.log(`This files found: ${allFiles.join(' ,')}`);
    fs.unlinkSync(this.settings.getTempCompressFilesFolder() + '/*');

    for (const file of allFiles) {
        const filePath = path.join(this.settings.getSourceFolder(), file);
        // const stats = fs.lstatSync(filePath);
        // if (!stats.isDirectory()) continue;
        const targetArchive = `${path.join(this.settings.getTempCompressFilesFolder(), file)}.7z`;
        this.log.log(`Compressig directory ${filePath} to ${targetArchive}`);
        const command = `7z a ${targetArchive} ${filePath}/* -aoa -mx=7`;
        this.log.log('Executing command: ' + command);
        try {
          this.execCommand(command);
        } catch (err) {
          this.log.error(err);
        }        
    }
    this.log.log('Copression is done.');
  }

  execCommand(cmd: string) {
    child_process.execSync(cmd);
  }
}
