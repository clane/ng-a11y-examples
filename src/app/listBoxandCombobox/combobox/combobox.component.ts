import { Component, 
         Input, 
         ViewChild, 
         Renderer,
         EventEmitter,
         OnInit,
         AfterViewInit,
         } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { State } from '../state';
import { StateService } from '../state.service';

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.css'],
  providers: [StateService]
})
export class ComboboxComponent implements OnInit {

  constructor(private titleService: Title, private stateService: StateService, private renderer: Renderer) {}
  componentTitle = 'Combobox';
  setTitle(newTitle:string) { this.titleService.setTitle(newTitle); }
  @ViewChild('componentHeading') elementToFocusOnInit;

  @ViewChild('input') input: any;
  expanded: boolean = false;  
  states: State[];
  @Input() state: State;
  selectedId: number = 0;
  keyPressCnt:number = 0;

  getStates(): void {
    this.stateService.getStates().then(states => this.states = states);
  }

  toggleExpanded() { 
    this.expanded = !this.expanded;
  }
  expand() { 
    this.expanded = true; 
  }

  collapse(){  
    this.expanded = false; 
  }

  firstCharAlphaSelect(event: any) {
      if (this.keyPressCnt === 0){
            setTimeout(()=>{ 
                let firstCharEntered = event.key;
                for(let i = 0; i < this.states.length; i++){ 
                    if(firstCharEntered.toUpperCase() == this.states[i].name.charAt(0)){
                        this.selectedId = i;
                        this.onListboxOptionSelected(this.states[i].name); 
                        break;
                    }
                }
            }, 0);

            this.keyPressCnt++;
      }
  }

  resetKeypressCnt(){ this.keyPressCnt = 0; }

  onListboxOptionSelected(stateName: string){
      this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
      this.renderer.setElementProperty(this.input.nativeElement, 'value', stateName);
      this.expanded = false;
      //Get the id for the state and use it to set the selected id
      for(let i = 0; i < this.states.length; i++){ 
          if(stateName == this.states[i].name){
              this.selectedId = this.states[i].id; 
          }
      } 
  }

  selectNextOption(){
      let stateName: string;
      if( this.selectedId == (this.states.length - 1)){
          this.selectedId = 0;
      } else {
          this.selectedId = this.selectedId + 1;
      }
      stateName = this.states[this.selectedId].name;
      this.renderer.setElementProperty(this.input.nativeElement, 'value', stateName);
  }

  selectPrevOption(){
      let stateName: string;
      if( this.selectedId == 0){
          this.selectedId = this.states.length - 1;
      } else {
          this.selectedId = this.selectedId - 1;
      }
      stateName = this.states[this.selectedId].name;
      this.renderer.setElementProperty(this.input.nativeElement, 'value', stateName);
  }

  onListboxEscPressed(){
      this.collapse();
      this.renderer.invokeElementMethod(this.input.nativeElement, 'focus');
  }

  ngOnInit() {
    this.setTitle(this.componentTitle);
    this.elementToFocusOnInit.nativeElement.focus();
  }

  ngAfterViewInit() {
      this.getStates();
  }


}
