import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PayloadType } from "../types/payload.types";

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    }
    handleRequest<TUser = PayloadType>(err: any, user: any): TUser {
        //1
        if (err || !user) {
            throw err || new UnauthorizedException();

        }
        console.log("user", user);
        // change to admin id 

        if (user.role === "d1483ebc-22a6-47d1-b442-9f1a632a62cb") {
            return user;
        }
        throw err || new UnauthorizedException();
    }
}