import { Server, Socket } from "socket.io";

class CustomWebSocket {
    private static socket : Socket[] = []
    private constructor() {
        
    }

    public static getClients() {
        return CustomWebSocket.socket
    }
    public static addClient(client) {
        CustomWebSocket.socket.push(client)
    }
}

export default CustomWebSocket