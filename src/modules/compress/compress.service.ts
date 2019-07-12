import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

@Injectable()
export class CompressService {

  constructor(private settings: SettingsService, private log: LoggerService) {
  }

  async compressDirectories() {
    this.log.log('Compression started.');
    this.log.log(`Compress all in ${this.settings.getSourceFolder()}`);
    const allFiles = fs.readdirSync(this.settings.getSourceFolder());
    this.log.log(`This files found: ${allFiles.join(' ,')}`);

    const exec = util.promisify(require('child_process').exec);

    for (const file of allFiles) {
        const filePath = path.join(this.settings.getSourceFolder(), file);
        // const stats = fs.lstatSync(filePath);
        // if (!stats.isDirectory()) continue;
        const targetArchive = `${path.join(this.settings.getTempCompressFilesFolder(), file)}.7zip`;
        this.log.log(`Compressig directory ${filePath} to ${targetArchive}`);
        const command = `7z a ${targetArchive} ${filePath}/* -mx=7`;
        this.log.log('Executing command: ' + command);
        const { stdout, stderr }  = await exec(command);
        if (stdout) this.log.log(stdout);
        if (stderr) this.log.error(stderr);
    }
    this.log.log('Copression is done.');
  }

}
