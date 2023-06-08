import { Server } from "socket.io";

class ServerSocket {
    private static serverSocket :Server

    private constructor() {}

    public static getServerInstance(server) {
        if(!this.serverSocket) {
            this.serverSocket = server
            return this.serverSocket
        }
        return this.serverSocket
    }

    public static getInstance() {
        return this.serverSocket
    }
}

export default ServerSocket