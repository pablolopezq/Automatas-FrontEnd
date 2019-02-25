export class Transition {
    value:string;
    destinations:string[] = [];

    constructor(value:string) {
        this.value = value;
    }

    addDestination(destination:string) {
        this.destinations.push(destination);
    }
}