import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import * as child_process from 'child_process';
import { CompressorBase } from './compress.service';

export class Compressor7zipService extends CompressorBase {

    constructor(private log: LoggerService) {
        super();
    }

    compress(sourcePath: string, destinationPath: string) {
        const targetArchive = destinationPath + '.' + this.getSuffix();
        this.log.log(`Compressig directory ${sourcePath} to ${targetArchive}`);
        const command = `7z a ${targetArchive} ${sourcePath}/* -aoa -mx=7`;
        this.log.log('Executing command: ' + command);
        child_process.execSync(command);
        return targetArchive;
    }

    getSuffix() {
        return '7z';
    }

}
