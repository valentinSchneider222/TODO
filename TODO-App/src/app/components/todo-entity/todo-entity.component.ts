import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { TodoDataService } from 'src/app/services/todo-data.service';

@Component({
  selector: 'app-todo-entity',
  templateUrl: './todo-entity.component.html',
  styleUrls: ['./todo-entity.component.scss']
})
export class TodoEntityComponent {

  @Input() state: boolean = false;
  @Input() text: string = '';
  @Input() id: string | undefined = '';
  @Input() groupId: string | undefined = '';

  @ViewChild('textField') textField!: ElementRef;

  private inputToSendDelay: any = undefined;

  constructor(private todoData: TodoDataService) { }

  public stateChange(data: MatCheckboxChange) {
    this.state = data.checked;
    this.updateTask();
  }

  public removeEntity() {
    this.todoData.removeTask(`${this.groupId}`, `${this.id}`);
  }

  public textChanged() {
    this.text = this.textField.nativeElement.value;
    this.updateTask();
  }

  private updateTask() {
    if (this.inputToSendDelay === undefined) {
      this.sendTask();
    } else {
      clearTimeout(this.inputToSendDelay);
      this.sendTask();
    }
  }

  private sendTask() {
    this.inputToSendDelay = setTimeout(() => {
      this.todoData.changeTask(`${this.groupId}`, `${this.id}`, this.state, this.text);
    }, 250);
  }
}
