import { Injectable } from '@nestjs/common';
import * as fs from 'fs';


@Injectable()
export class SettingsService {

    private pathToGoogleTokens: string;

    private sourceFolder: string;

    private googleAppIdsData: GoogleAppIdsData;

    private googleTokens: GoogleTokens;

    private tempCompressFilesFolder: string;

    private targetFolderName: string;

    private compressType: CompressionType;

    constructor(private pathToConfig: string) {
        this.loadSettings();
    }

    public getSourceFolder() {
        return this.sourceFolder;
    }

    public getTempCompressFilesFolder() {
        return this.tempCompressFilesFolder;
    }    

    public getTargetFolderName() {
        return this.targetFolderName;
    }

    public getGoogleAppIdsData() {
        return this.googleAppIdsData;        
    }

    public isGoogleTokensSetup() {
        return fs.existsSync(this.pathToGoogleTokens);
    }

    public getGoogleTokens() {
        return this.googleTokens;
    }

    public getCompressType() {
        return this.compressType;
    }

    public saveGoogleTokens(tokens: GoogleTokens) {
        const dataClean = {access_token: tokens.access_token, refresh_token: tokens.refresh_token, expires_in: tokens.expires_in, token_type: tokens.token_type};
        fs.writeFileSync(this.pathToGoogleTokens, JSON.stringify(dataClean));
    }

    public reloadSettings() {
        this.loadSettings();
    }


    private loadSettings() {
        const configString = fs.readFileSync(this.pathToConfig, 'utf8');
        const configData = JSON.parse(configString);
        this.sourceFolder = process.env.SOURCE_FOLDER || configData.source_folder;
        
        const pathToGoogleIds = process.env.GOOGLE_IDS_FILE || configData.googleIdsFile;
        const googleIdsStringData = fs.readFileSync(pathToGoogleIds, 'utf8');
        this.googleAppIdsData = JSON.parse(googleIdsStringData);
        
        this.pathToGoogleTokens = process.env.PATH_TO_GOOGLE_TOKENS || configData.pathToGoogleTokens;
        this.tempCompressFilesFolder = process.env.PATH_TEMP_COMPRESS_FILE_FILDER || configData.tempCompressFilesFolder;
        this.targetFolderName = process.env.TARGET_FOLDER_NAME || configData.targetFolderName;
        this.compressType = process.env.COMPRESS_TYPE || configData.compressType;

        if (this.isGoogleTokensSetup()) {
            this.googleTokens = JSON.parse(fs.readFileSync(this.pathToGoogleTokens, 'utf8'));
        }
    }
}

export interface GoogleTokens {
    
    access_token: string;

    refresh_token: string;

    expires_in: number;

    token_type: string;

}

export interface GoogleAppIdsData {

    installed: {
        client_id: string;
        project_id: string;
        auth_uri: string; 
        token_uri: string;
        auth_provider_x509_cert_url: string;
        client_secret: string;
        redirect_uris: string[];
    }

}

export enum CompressionType {
    ZIP7='7ZIP',
    TARBZ2='TARBZ2'
}
