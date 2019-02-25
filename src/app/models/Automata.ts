import { State } from './State';
import { splitClasses, JitSummaryResolver } from '@angular/compiler';
import { async } from '@angular/core/testing';

export class Automata {
    name:string;
    states:State[] = [];
    initial:string;
    alphabet:string[] = [];

    constructor(name:string) {
        this.name = name;
    }

    addState(name:string, final:boolean) {
        if(this.states.length == 0){
            this.initial = name;
        }
        var newState:State = new State(name, final);
        this.states.push(newState);
    }

    addTransition(source:string, destination:string, value:string) {
        if(this.alphabet.includes(value)){
            //this.states.find(i => i.name === source).addTransition(value, destination);
            var newStates:State[] = this.states;
            var i = newStates.findIndex(x => x.name == source);
            newStates[i].addTransition(value, destination);
            this.states = newStates;
        }
        console.log(this.states);
    }

    addToAlphabet(value:string) {
        this.alphabet.push(value);
    }

    removeFromAlphabet(value:string) {
        if(this.alphabet.includes(value)) {
            var i = this.alphabet.findIndex(x => x == value);
            var removed = this.alphabet.splice(i, 1);
            console.log("Removed: " + removed);
        } else {
            console.log("Value doesnt exist");
        }
    }

    stateExists(state:string) {
        for(const s of this.states) {
            if(s.name == state){
                return true;
            }
        }
        return false;
    }

    removeStates(state:string) {
        if(this.stateExists(state)) {
            var i = this.states.findIndex(x => x.name == state);
            var removed = this.states.splice(i, 1);
            console.log("Removed: " + removed[0].name);
        } else {
            console.log("State doesnt exist");
        }
    }

    containsInvalidCharacters(expression:string) {
        for(const c of expression) {
            if(this.alphabet.includes(c)) {
                return false;
            }
        }
        return true;
    }

    hasTransition(state:string, value:string) {
        var temp = this.states.find(x => x.name == state);
        for(const t of temp.transitions) {
            if(t.value = value) {
                return true;
            }
        }
        return false;
    }

    getDestination(state:string, value:string, i:number) {
        var temp = this.states.find(x => x.name == state);
        for(const t of temp.transitions) {
            if(t.value == value) {
                return t.destinations[i];
            }
        }
    }

    isFinal(state:string) {
        return this.states.find(x => x.name == state).final
    }

    evaluate(expression:string) {
        var currentState:string = this.initial;
        if(this.containsInvalidCharacters(expression)) {
            console.log("Invalid Characters")
            return false;
        } else {
            for(const c of expression) {
                var temp = currentState;
                currentState = this.getDestination(temp, c, 0);
            }
            if(this.isFinal(currentState)) {
                return true;
            } else {
                return false;
            }
        }
    }

    createFromRegex(regex:string) {}

    isNFAE() {
        if(this.alphabet.includes("E")){
            return true;
        }
        return false;
    }

    getCerraduras() {
        var retorno:State[] = [];
        if(this.alphabet.length == 0) {
            return retorno;
        } else {
            for(const v of this.states) {
                var temp = new State(v.name, v.final);
                temp.addTransition("E", v.name);
                for(const t of v.transitions){
                    if(t.value == "E") {
                        for(const d of t.destinations) {
                            temp.addTransition("E", d);
                        }
                    }
                }
                retorno.push(temp);
            }
            return retorno;
        }
    }

    getDeltas(states:State[], value:string) {
        var retorno:State[] = [];
        for(const s of states) {
            var temp:State = new State(s.name, s.final);
            var p = s.transitions.find(x => x.value == "E");
            if(p != undefined) {
                //console.log("Destinations of cerradura: ", p)
                for(const r of p.destinations){
                    var q = this.states.find(q => q.name == r);
                    //console.log(q);
                    var transition = q.transitions.find(x => x.value == value);
                    //console.log(transition);
                    if(transition != undefined) {
                        //console.log("Entered For");
                        for(const d of transition.destinations) {
                            temp.addTransition(value, d);
                        }
                    }
                }
            }
            retorno.push(temp);
        }
        return retorno;
    }

    getSpecCerraduras(states:State[], value:string) {
        //console.log("Value", value);
        var retorno:State[] = [];
        if(this.alphabet.length == 0) {
            return retorno;
        } else {
            for(const v of states) {
                var temp = new State(v.name, v.final);
                var p = v.transitions.find(x => x.value == value);
                if(p != undefined) {
                    //console.log("Delta transitions: ", p);
                    //temp.addTransition(value, v.name);
                    for(const d of p.destinations){
                        var q = this.states.find(x => x.name == d);
                        //console.log("State: ", q);
                        var transitions = q.transitions.find(x => x.value == "E");
                        //console.log("State transitions", transitions);
                        temp.addTransition(value, d);
                        if(transitions != undefined) {
                            if(transitions.value == "E") {
                                for(const r of transitions.destinations) {
                                    temp.addTransition(value, r);
                                }
                            }
                        }
                    }
                }
                retorno.push(temp);
            }
            return retorno;
        }
    }

    toNFA() {
        var newAutomata = new Automata(this.name);
        if(!this.isNFAE){
            newAutomata = new Automata("Invalid");
            return newAutomata;
        } else {
            var cerraduras:State[] = this.getCerraduras();
            var delta:State[] = [];
            var deltas:State[][] = [];
            var lastCerraduras:State[][] = [];

            //console.log("Cerraduras: ", cerraduras);

            var i = 0;
            for(const v of this.alphabet) {
                if(v != "E") {
                    deltas[i] = this.getDeltas(cerraduras, v);
                    i++;
                }
            }

            //console.log("Deltas: ", deltas)

            // for (let index = 0; index < deltas.length; index++) {
            //     lastCerraduras[index] = this.getSpecCerraduras(deltas[index]);
            // }
            i = 0;
            for(const v of this.alphabet) {
                if(v != "E") {
                    lastCerraduras[i] = this.getSpecCerraduras(deltas[i], v);
                    i++
                }
            }

            //console.log("Cerraduras last: ", lastCerraduras);

            var newStates:State[] = [];

            for(const q of this.states) {
                var t = new State(q.name, q.final);
                newStates.push(t);
            }

            for(let ind = 0; ind < lastCerraduras.length; ind++){
                for(let a = 0; a < lastCerraduras[ind].length; a++) {
                    //console.log("Cerraduras ", lastCerraduras[ind][a]);
                    newStates[a].mergeTransitions(lastCerraduras[ind][a]);
                }
            }

            //console.log("New States: ", newStates)

            this.removeFromAlphabet("E");
            newAutomata.alphabet = this.alphabet;
            newAutomata.initial = this.initial;
            newAutomata.states = newStates;
            
            return newAutomata;
        }
    }

    isNFA() {
        for(const state of this.states) {
            for(const transition of state.transitions) {
                if(transition.destinations.length > 1) {
                    return true;
                }
            }
        }
        return false;
    }

    arraysEqual(_arr1, _arr2) {
        if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
          return false;
    
        var arr1 = _arr1.concat().sort();
        var arr2 = _arr2.concat().sort();
    
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }

    ifStatePrecExists(state:string[], statesFinal:State[], statesTemp:State[]) {
        var exists = false;

        for(const s of statesFinal) {
            if(this.arraysEqual(state, s.predecesors)){
                exists = true;
            }
        }

        for(const s of statesTemp) {
            if(this.arraysEqual(state, s.predecesors)){
                exists = true;
            }
        }

        return exists;
    }

    toDFA(){
        var newAutomata;

        if(this.isNFA()) {
            newAutomata = new Automata(this.name);
            var newStatesFinal:State[] = [];
            var newStatesTemp:State[] = [];
            var stateCount = 1;
            var q = this.states.find(x => x.name == this.initial);
            var tempState = new State("0", q.final);

            for(const value of this.alphabet) {
                var t = q.transitions.find(x => x.value == value);
                if(t != undefined) {
                    var temp = new State(String(stateCount), false);
                    for(const destination of t.destinations) {
                        temp.predecesors.push(destination);
                        if(this.isFinal(destination)) {
                            temp.final = true;
                        }
                    }
                    tempState.addTransition(value, temp.name);
                    newStatesTemp.push(temp);
                    newStatesFinal.push(tempState);
                    stateCount++;
                }
            }
            
            while(newStatesTemp.length != 0) {
                var exists = false;
                var s = newStatesTemp[0];
                var tempState = new State(String(stateCount), false);

                for(const value of this.alphabet) {
                    for(const pre of s.predecesors) {
                        var transitions = this.states.find(x => x.name == pre).transitions;
                        if(transitions != undefined) {
                            var t = transitions.find(x => x.value == value);
                            if(t != undefined) {
                                var destinations = t.destinations;
                                if(destinations != undefined) {
                                    for(const dest of destinations) {
                                        if(this.isFinal(dest)){
                                            tempState.final = true;
                                        }
                                        if(!tempState.predecesors.includes(dest)){
                                            tempState.predecesors.push(dest);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    newStatesTemp[0].addTransition(value, tempState.name);
                    stateCount++;
                    exists = this.ifStatePrecExists(tempState.predecesors, newStatesFinal, newStatesTemp);
                    if(exists) {
                        newStatesTemp.push(tempState);
                        console.log("Added", tempState.predecesors)
                    }
                }
                var x = newStatesTemp.pop();
                newStatesFinal.push(x);
            }

            newAutomata.alphabet = this.alphabet;
            newAutomata.initial = this.initial;
            newAutomata.states = newStatesFinal;

        } else {
            newAutomata = new Automata("Invalid");
        }

        return newAutomata;
    }
}