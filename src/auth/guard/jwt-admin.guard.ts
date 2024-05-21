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

        if (user.role === "48adee28-24cf-4860-9ae1-c44f5c1d50f8") {
            return user;
        }
        throw err || new UnauthorizedException();
    }
}