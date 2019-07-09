import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class SettingsService {

    private sourceFolder: string;

    private googleAppIdsData: GoogleAppIdsData;

    constructor(pathToConfig: string) {
        const configString = fs.readFileSync(pathToConfig, 'utf8');
        const configData = JSON.parse(configString);
        this.sourceFolder = process.env.sourceFolder || configData.source_folder;
        
        const pathToGoogleIds = process.env.googleIdsFile || configData.googleIdsFile;
        const googleIdsStringData = fs.readFileSync(pathToGoogleIds, 'utf8');
        this.googleAppIdsData = JSON.parse(googleIdsStringData);
    }

    public getSourceFolder() {
        return this.sourceFolder;
    }

    public getTargetFolder() {
        return '/home/node/data';
    }

    public getGoogleAppIdsData() {
        return this.googleAppIdsData;        
    }
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
