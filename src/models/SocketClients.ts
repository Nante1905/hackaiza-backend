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

    public static deleteClient(client) {
        for(let clientConn of this.clients) {
            if(clientConn.data.id == client.data.id) {
                let i = this.clients.indexOf(clientConn)
                this.clients.splice(i, 1)
            }
        }
    }
    public static deleteDriver(driver) {
        for(let driverConn of this.drivers) {
            if(driverConn.data.id == driver.data.id) {
                let i = this.drivers.indexOf(driverConn)
                this.drivers.splice(i, 1)
            }
        }
    }
}

export default SocketClients