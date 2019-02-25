import { Component } from '@angular/core';
import { Automata } from './models/Automata'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  automata:Automata;
  test = "test";

  onNewAutomata(newAutomata:Automata) {
    this.automata = newAutomata;
    //Send to database
    console.log("Automata in app-component")
    console.log(this.automata);
  }
}