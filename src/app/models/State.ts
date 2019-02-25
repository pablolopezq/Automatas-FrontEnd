import { Transition } from './Transition';

export class State {
    name:string;
    transitions:Transition[] = [];
    final:boolean;
    predecesors:string[] = [];

    constructor(name:string, final:boolean) {
        this.name = name;
        this.final = final;
    }

    mergeTransitions(state:State) {
        for(const t of state.transitions) {
            for(const d of t.destinations) {
                this.addTransition(t.value, d);
            }
        }
    }

    valueExists(value:string) {
        for(const transition of this.transitions) {
            if(transition.value === value) {
                return true;
            }
        }
        return false;
    }

    addTransition(value:string, destination:string) {
        if(this.valueExists(value)){
            this.transitions.find(x => x.value == value).addDestination(destination);
        } else {
            var newTransition:Transition;
            newTransition = new Transition(value);
            newTransition.addDestination(destination);
            this.transitions.push(newTransition);
        }
    }
}