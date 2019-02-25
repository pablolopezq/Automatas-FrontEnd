import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Automata } from '../../models/Automata'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  @Output() automata = new EventEmitter<Automata>();
  tempAutomata:Automata;
  @Input() test:string;

  onAutomataSubmit(automata:any) {
    console.log("Automata Submit Works: ", automata)
    this.tempAutomata = new Automata(automata);
    this.automata.emit(this.tempAutomata);
  }

  onStateSubmit(state:any, final:boolean) {
    console.log("Submit State Works: " + state)
    this.tempAutomata.addState(state, final);
    this.automata.emit(this.tempAutomata);
  }

  onTransitionSubmit(source:string, destination:string, value:string){
    console.log("Submit Transition Works" + source + "to" + destination + "with" + value);
    this.tempAutomata.addTransition(source, destination, value);
    this.automata.emit(this.tempAutomata);
  }

  onAlphabetSubmit(value:string) {
    console.log("Submit Alphabet Works: " + value);
    this.tempAutomata.addToAlphabet(value);
    this.automata.emit(this.tempAutomata);
  }

  onAlphabetRemove(value:string) {
    console.log("Remove Alphabet Works: " + value);
    this.tempAutomata.removeFromAlphabet(value);
    this.automata.emit(this.tempAutomata);
  }

  onEvaluate(expression:string) {
    this.tempAutomata = new Automata("new");
    this.tempAutomata.addState("q0", false);
    this.tempAutomata.addState("q1", false);
    this.tempAutomata.addState("q2", true);
    this.tempAutomata.addToAlphabet("0");
    this.tempAutomata.addToAlphabet("1");
    this.tempAutomata.addTransition("q0", "q0", "1");
    this.tempAutomata.addTransition("q0", "q1", "0");
    this.tempAutomata.addTransition("q1", "q1", "0");
    this.tempAutomata.addTransition("q1", "q2", "1");
    this.tempAutomata.addTransition("q2", "q2", "1");
    this.tempAutomata.addTransition("q2", "q2", "0");
    console.log(this.tempAutomata.evaluate(expression))
  }

  onRegex(regex:string, name:string) {
    this.tempAutomata = new Automata(name);
    this.tempAutomata.createFromRegex(regex);
    this.automata.emit(this.tempAutomata);
  }

  onToNFA() {
    this.tempAutomata = new Automata("new");
    this.tempAutomata.addState("0", false);
    this.tempAutomata.addState("1", false);
    this.tempAutomata.addState("2", true);
    this.tempAutomata.addState("3", false);
    this.tempAutomata.addState("4", false);
    this.tempAutomata.addState("5", false);
    this.tempAutomata.addToAlphabet("a");
    this.tempAutomata.addToAlphabet("b");
    this.tempAutomata.addToAlphabet("E");
    this.tempAutomata.addTransition("0","1","E");
    this.tempAutomata.addTransition("0","3","a");
    this.tempAutomata.addTransition("1","2","b");
    this.tempAutomata.addTransition("1","4","a");
    this.tempAutomata.addTransition("3","1","E");
    this.tempAutomata.addTransition("3","4","b");
    this.tempAutomata.addTransition("4","5","E");

    var t = this.tempAutomata.toNFA();
    if(t.name != "Invalid"){
      this.tempAutomata = t;
    }
    this.automata.emit(this.tempAutomata);
  }

  onToDFA() {
    var t = this.tempAutomata.toDFA();
    if(t.name != "Invalid"){
      this.tempAutomata = t;
    }
    this.automata.emit(this.tempAutomata);
  }

  ngOnInit() {
  }
}