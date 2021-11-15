import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/interfaces/task';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {

  @Input() entities: Task[] = [];
  @Input() title: string = '';
  @Input() groupId: string = '';

  @ViewChild('titleField') titleField!: ElementRef;

  constructor() { }

  public addTask() {
    this.entities.push({done: false, text: '', id: ''});
  }

  public titleChanged(){
    this.title = this.titleField.nativeElement.value;
  }

}
