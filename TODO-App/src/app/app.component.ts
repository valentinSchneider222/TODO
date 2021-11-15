import { Component } from '@angular/core';
import { TodoGroup } from './interfaces/todo-group';
import { TodoDataService } from './services/todo-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public todoGroups: TodoGroup[] = [];

  constructor(private data: TodoDataService) {
    this.todoGroups = [
      {
        entities: [
          {
            done: false,
            text: 'Cats',
            id: 'pic00'
          },
          {
            done: true,
            text: 'Dogs',
            id: 'pic01'
          },
          {
            done: false,
            text: 'Crows',
            id: 'pic02'
          },
          {
            done: false,
            text: 'Spiderman',
            id: 'pic03'
          },
          {
            done: false,
            text: 'Sunrise',
            id: 'pic04'
          },
          {
            done: false,
            text: 'Dawn',
            id: ''
          },
        ],
        title: 'Pictures to take:',
        id: 'group0'
      },
      {
        entities: [
          {
            done: false,
            text: 'Falaffel',
            id: 'food00'
          },
          {
            done: false,
            text: 'Hummus',
            id: 'food01'
          },
          {
            done: true,
            text: 'Spaghetti alio olio',
            id: 'food02'
          },
        ],
        title: 'Things to cook: ',
        id: 'group1'
      }
    ]
  }

  public addGroup() {
    this.todoGroups.unshift({
      id: '',
      title: '',
      entities: []
    });
  }
}
