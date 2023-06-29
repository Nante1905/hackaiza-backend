import { Socket } from "socket.io";

class SocketClients {
    private static drivers :Socket[] = []
    private static clients :Socket[] = []


    public static addClient(socket) {
        SocketClients.clients.push(socket)
    }

    public static addDriver(socket) {
        SocketClients.drivers.push(socket)
    }

    public static getDrivers() {
        return SocketClients.drivers
    }

    public static getClients() {
        return SocketClients.clients
    }

    public static deleteClient(client) {
        const newClients = SocketClients.clients.filter((socket) => (socket.data.id[0] !== client.data.id[0]))
        SocketClients.clients = newClients
        console.log("new clients", newClients, newClients.length)
        // console.log(this.clients.map(cl => cl.id))
        // for(let clientConn of this.clients) {
        //     if(clientConn.data.id == client.data.id) {
        //         let i = this.clients.indexOf(clientConn)
        //         this.clients.splice(i, 1)
        //     }
        // }
    }
    public static deleteDriver(driver) {
        const newDrivers = SocketClients.drivers.filter((socket) => (socket.data.id[0] !== driver.data.id[0]))
        SocketClients.drivers = newDrivers
        console.log("new drivers",newDrivers, newDrivers.length)
        // console.log(this.drivers.map(dr => dr.id))
        // for(let driverConn of this.drivers) {
        //     if(driverConn.data.id == driver.data.id) {
        //         let i = this.drivers.indexOf(driverConn)
        //         this.drivers.splice(i, 1)
        //     }
        // }
    }
    public static findDriver(id) :Socket {
        for(let socket of SocketClients.drivers) {
            if(socket.data.id[0] == id) {
                return socket
            }
        }
    }

    public static findClient(id) :Socket {
        for(let socket of SocketClients.clients) {
            if(socket.data.id[0] == id) {
                return socket
            }
        }
    }
}

export default SocketClients