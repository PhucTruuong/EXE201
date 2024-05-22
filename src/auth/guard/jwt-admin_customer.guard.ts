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
        if (err || !user) {
            throw err || new UnauthorizedException();

        }
        console.log("user", user);
        // change to admin id 

        if (user.role === "31129e6e-6025-494a-a02d-375441ec603a" ||"d1483ebc-22a6-47d1-b442-9f1a632a62cb") {
            return user;
        }
        throw err || new UnauthorizedException();
    }
}