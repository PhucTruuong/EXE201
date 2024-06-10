import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PayloadType } from "../types/payload.types";

@Injectable()
export class JwtHostGuard extends AuthGuard('jwt'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    };
    
    handleRequest<TUser = PayloadType>(err: any, user: any): TUser {
        //1
        if (err || !user) {
            throw err || new UnauthorizedException();
        };
        
        console.log("user", user);
        // change to service id 
        if (user.role === "host") {
            return user;
        };
        throw err || new UnauthorizedException();
    };
};