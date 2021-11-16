import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { TodoDataService } from 'src/app/services/todo-data.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {

  @Input() entities: Task[] = [];
  @Input() title: string = '';
  @Input() groupId: string | undefined = '';

  @ViewChild('titleField') titleField!: ElementRef;

  private inputToSendDelay: any = undefined;

  constructor(private todoData: TodoDataService) { }

  public addTask() {
    this.todoData.addTask(`${this.groupId}`);
  }

  public titleChanged() {
    this.title = this.titleField.nativeElement.value;
    if (this.inputToSendDelay === undefined) {
      this.sendGroupRename();
    } else {
      clearTimeout(this.inputToSendDelay);
      this.sendGroupRename();
    }
  }

  private sendGroupRename() {
    this.inputToSendDelay = setTimeout(() => {
      this.todoData.renameGroup(this.title, `${this.groupId}`);
    }, 250);
  }

}
