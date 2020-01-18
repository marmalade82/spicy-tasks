
import moment from "moment";
import { Moment } from "moment";


export default class MyDate {
    m: Moment;
    constructor() {
        this.m = moment() // initialize moment to now
    }


    subtract = (n: number, val: "days"): this => {
        this.m.subtract(n, val);

        return this;
    }

    toDate = (): Date => {
        return this.m.toDate();
    }

    nextMidnight = (): this => {
        this.m.endOf('day');

        return this;
    }

    prevMidnight = (): this => {
        this.m.startOf('day');

        return this;
    }
}