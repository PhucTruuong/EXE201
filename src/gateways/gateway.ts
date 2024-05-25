import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class MyGateWay{
    @SubscribeMessage('new Message')
    onNewMessage(@MessageBody() body:any){
        console.log("body" ,body)
    }

}
