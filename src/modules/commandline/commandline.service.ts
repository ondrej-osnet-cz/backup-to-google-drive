import { Injectable, Logger } from '@nestjs/common';
import * as readline from 'readline';

@Injectable()
export class CommandLineService {

    async askForGoogleCode(user_code: string, verification_url: string) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise((resolve, reject) => {
            rl.question(`1) Please open this URL in your browser: ${verification_url} \n`
                +`2) Then insert this code: ${user_code} \n`
                +'Plese tell me Goolge code:', (answer) => {
                    rl.close();
                    resolve(answer);
            });
        });
    }

}
