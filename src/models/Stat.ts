class Stat {
    constructor() {
    }

    public static getPrevMonth(n: number): number {
        if(n == 1) {
            return 12;
        }
        return n-1;
    }

    public static getVariation(n1: number, n2: number) {
        if(n1 == 0) {
            return 100;
        }
        return ((n2-n1)/n1)*100;
    }
}

export default Stat