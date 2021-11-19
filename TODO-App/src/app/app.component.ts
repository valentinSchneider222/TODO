import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { TodoGroup } from './interfaces/todo-group';
import { TodoDataService } from './services/todo-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public todoGroups: TodoGroup[] = [];

  constructor(private todoData: TodoDataService) {
    this.todoData.data.pipe(
      filter(x => !!x)
    ).subscribe(x => {
      this.todoGroups = x;
    });
  }

  public addGroup() {
    this.todoData.addGroup('');
  }
}
