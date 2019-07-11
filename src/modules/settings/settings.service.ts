import { Injectable } from '@nestjs/common';
import * as fs from 'fs';


@Injectable()
export class SettingsService {

    private readonly pathToGoogleTokens = '/home/node/secret/googleTokens.json';

    private sourceFolder: string;

    private googleAppIdsData: GoogleAppIdsData;

    private googleTokens: GoogleTokens;

    constructor(pathToConfig: string) {
        const configString = fs.readFileSync(pathToConfig, 'utf8');
        const configData = JSON.parse(configString);
        this.sourceFolder = process.env.sourceFolder || configData.source_folder;
        
        const pathToGoogleIds = process.env.googleIdsFile || configData.googleIdsFile;
        const googleIdsStringData = fs.readFileSync(pathToGoogleIds, 'utf8');
        this.googleAppIdsData = JSON.parse(googleIdsStringData);
        
        if (configData.pathToGoogleTokens) this.pathToGoogleTokens = configData.pathToGoogleTokens;

        if (this.isGoogleTokensSetup()) {
            this.googleTokens = JSON.parse(fs.readFileSync(this.pathToGoogleTokens, 'utf8'));
        }
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

    public isGoogleTokensSetup() {
        return fs.existsSync(this.pathToGoogleTokens);
    }

    public getGoogleTokens() {
        return this.googleTokens;
    }

    public saveGoogleTokens(tokens: GoogleTokens) {
        const dataClean = {access_token: tokens.access_token, refresh_token: tokens.refresh_token};
        fs.writeFileSync(this.pathToGoogleTokens, JSON.stringify(dataClean));
    }
}

export interface GoogleTokens {
    
    access_token: string;

    refresh_token: string;

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
