import { Injectable, Logger, HttpService } from '@nestjs/common';
import * as readline from 'readline';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class GoogleAuthService {
    
    constructor(private readonly httpService: HttpService, private settings: SettingsService, private logger: LoggerService) {        
    }

    async getClientAuthUrl() {
        try {
            const client_id = this.settings.getGoogleAppIdsData().installed.client_id;
            const googleResponse = await this.httpService.post(
                `https://accounts.google.com/o/oauth2/device/code?client_id=${client_id}&scope=https://www.googleapis.com/auth/drive.file`)
                .toPromise();
            const data = googleResponse.data; 
            const timeOut = new Date().getTime() + parseInt(data.expires_in) * 1000;
            const interval = parseInt(data.interval) < 2 ? 2 : parseInt(data.interval);
            this.logger.log(`\n\n\n1) Please open this URL in your browser: ${data.verification_url}\n\n2) Then insert this code: ${data.user_code}`);
            return new Promise((resolve, reject) => {
                while (timeOut > new Date().getTime()) {
                    setTimeout(
                        () => {
                            
                        }
                    ,interval * 1000);
                }
            });
        } catch (err) {
            this.logger.error(err, err.trace, err.context);
        }        
    }

}
