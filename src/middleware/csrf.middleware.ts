import { Injectable, NestMiddleware } from '@nestjs/common';
import * as csurf from 'csurf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
    private readonly csrfProtection: any;

    constructor() {
        this.csrfProtection = csurf({ cookie: true });
    }

    use(req: any, res: any, next: any) {
        this.csrfProtection(req, res, (err: any) => {
            if (err) {
                next(err);
            } else {
                const token = req.csrfToken();
                res.cookie('XSRF-TOKEN', token);
                res.locals.csrfToken = token;
                next();
            }
        });
    };
};
