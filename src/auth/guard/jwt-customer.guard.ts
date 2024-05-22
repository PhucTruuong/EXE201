import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PayloadType } from "../types/payload.types";

@Injectable()
export class JwtCustomerGuard extends AuthGuard('jwt'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    }
    handleRequest<TUser = PayloadType>(err: any, user: any): TUser {
         //1
         if(err || !user){
            throw err || new UnauthorizedException();
        
         }
         console.log("user",user);
         if(user.role === "31129e6e-6025-494a-a02d-375441ec603a"){
            return user;
         }
         throw err || new UnauthorizedException();
    }
}