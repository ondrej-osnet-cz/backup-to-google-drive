import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {

    constructor() {
        super();
        if (process.env.NODE_ENV === 'production') {
            this.debug = () => {};
        }
    }

}
