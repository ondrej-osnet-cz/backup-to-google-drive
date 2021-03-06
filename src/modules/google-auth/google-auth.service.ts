import { Injectable, HttpService } from '@nestjs/common';
import { SettingsService, GoogleTokens } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class GoogleAuthService {

    constructor(private readonly httpService: HttpService, private settings: SettingsService, private logger: LoggerService) {
    }

    async authenticateGoogleDrivePermision(): Promise<GoogleTokens> {
        try {
            const client_id = this.settings.getGoogleAppIdsData().installed.client_id;
            const googleResponse = await this.httpService.post(
                `https://accounts.google.com/o/oauth2/device/code?client_id=${client_id}&scope=https://www.googleapis.com/auth/drive.file`)
                .toPromise();
            const data = googleResponse.data as GoogleAuthResponseData;
            const timeOut = new Date().getTime() + parseInt(data.expires_in, 10) * 1000;
            const interval = parseInt(data.interval, 10) < 2 ? 2 : parseInt(data.interval, 10);
            this.logger.log(`\n\n\n1) Please open this URL in your browser: ${data.verification_url}\n2) Then insert this code: ${data.user_code}`);
            while (timeOut > new Date().getTime()) {
                // check whether the user has granted permission loop
                this.logger.debug('try google ask in interval ' + interval + 's');
                await this.sleep(interval * 1000);
                let url = 'https://www.googleapis.com/oauth2/v4/token?';
                url += 'client_id=' + client_id;
                url += '&client_secret=' + this.settings.getGoogleAppIdsData().installed.client_secret;
                url += '&code=' + data.device_code;
                url += '&grant_type=http://oauth.net/grant_type/device/1.0';
                try {
                    // if return HTTP status 200 - OK, permission granted
                    const googleCheck = await this.httpService.post(url).toPromise();
                    this.logger.log('Google permission granted!');
                    const googleData = googleCheck.data;
                    return googleData;
                } catch (err) {
                    if (err.status === 403 || err.status === 401) {
                        // user did not grand permission
                        throw err;
                    }
                    this.logger.debug(err.messsage);
                }
            }
            throw new Error('Timeouted');
        } catch (err) {
            this.logger.error(err, err.trace, err.context);
        }
    }

    async sleep(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }

}

interface GoogleAuthResponseData {

    expires_in: string;

    interval: string;

    verification_url: string;

    user_code: string;

    device_code: string;
}
