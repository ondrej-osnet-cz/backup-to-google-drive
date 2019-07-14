import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';

@Injectable()
export abstract class CompressorBase {

  abstract compress(sourcePath: string, destinationPath: string);

  abstract getSuffix();

}

@Injectable()
export class CompressService {

  constructor(private settings: SettingsService, private log: LoggerService, private compressor: CompressorBase) {
  }

  async compressDirectories() {
    this.log.log('Compression started.');
    this.log.log(`Compress all in ${this.settings.getSourceFolder()}`);
    const allFiles = fs.readdirSync(this.settings.getSourceFolder());
    this.log.log(`This files found: ${allFiles.join(' ,')}`);

    this.log.log('Deleting temp directory');
    const allTepmsFile = fs.readdirSync(this.settings.getTempCompressFilesFolder());
    for (const temp of allTepmsFile) {
      const filePath = path.join(this.settings.getTempCompressFilesFolder(), temp);
      this.log.log('Deleting temp file: ' + filePath);
      fs.unlinkSync(filePath);
    }

    for (const file of allFiles) {
        const sourcePath = path.join(this.settings.getSourceFolder(), file);
        const destinationPath = path.join(this.settings.getTempCompressFilesFolder(), file)
        // const stats = fs.lstatSync(filePath);
        // if (!stats.isDirectory()) continue;        
        try {
          this.compressor.compress(sourcePath, destinationPath);
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
