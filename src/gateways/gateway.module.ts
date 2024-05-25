import { Module } from "@nestjs/common";
import { MyGateWay } from "./gateway";

@Module({
    providers:[MyGateWay],
    imports:[],
    controllers:[]
})
export class GatewayModule{}