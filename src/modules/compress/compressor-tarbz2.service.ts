import { Injectable, LoggerService } from "@nestjs/common";
import * as child_process from 'child_process';
import { CompressorBase } from "./compress.service";

export class CompressorTarBz2Service extends CompressorBase  {

    constructor(private log: LoggerService) {
        super();
    }

    compress(sourcePath: string, destinationPath: string) {
        const targetArchive = destinationPath + '.' + this.getSuffix();
        this.log.log(`Compressig directory ${sourcePath} to ${targetArchive}`);
        const command = `tar -cvjSf ${targetArchive} ${sourcePath}`;
        this.log.log('Executing command: ' + command);
        child_process.execSync(command);
        return targetArchive;
    }

    getSuffix() {
        return 'tar.bz2';
    }

}