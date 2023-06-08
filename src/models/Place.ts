class Place {
    name!: string;
    longitude!: number;
    latitude!: number;

    constructor(name:string, longitude: number, latitude: number) {
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}

export default Place