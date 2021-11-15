import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-todo-entity',
  templateUrl: './todo-entity.component.html',
  styleUrls: ['./todo-entity.component.scss']
})
export class TodoEntityComponent {

  @Input() state: boolean = false;
  @Input() text: string = '';
  @Input() id: string = '';
  @Input() groupId: string = '';

  @ViewChild('textField') textField!: ElementRef;

  constructor() { }

  public stateChange(data: MatCheckboxChange) {
    this.state = data.checked;
  }

  public removeEntity() {

  }

  public textChanged() {
    this.text = this.textField.nativeElement.value;
  }
}
