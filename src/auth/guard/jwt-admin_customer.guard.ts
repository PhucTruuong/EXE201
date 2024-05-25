import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PayloadType } from "../types/payload.types";

@Injectable()
export class JwtAdminServiceGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    }
    handleRequest<TUser = PayloadType>(err: any, user: any): TUser {
        //1
        console.log("user: ", user);
        if (err || !user) {
            throw err || new UnauthorizedException();
        };
        // change to admin id 

        if (user.role === "host" || "admin") {
            return user;
        };

        throw err || new UnauthorizedException();
    }
}