import { Socket } from "socket.io";

class SocketClients {
    private static drivers :Socket[] = []
    private static clients :Socket[] = []


    public static addClient(socket) {
        this.clients.push(socket)
    }

    public static addDriver(socket) {
        this.drivers.push(socket)
    }

    public static getDrivers() {
        return this.drivers
    }

    public static getClients() {
        return this.clients
    }
}

export default SocketClients