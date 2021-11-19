import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../interfaces/task';
import { TodoGroup } from '../interfaces/todo-group';

@Injectable({
  providedIn: 'root'
})
export class TodoDataService {

  public data: BehaviorSubject<TodoGroup[]> = new BehaviorSubject<TodoGroup[]>([]);

  constructor(private http: HttpClient) {
    this.getTodos();
  }

  public addGroup(groupName: string) {
    firstValueFrom(this.http.put<TodoGroup>(environment.backendUrl + '/group', { title: groupName }))
      .then(data => {
        const newStuff = this.data.value;
        newStuff.unshift(data);
        this.data.next(newStuff);
      })
      .catch(err => console.error(err));
  }

  public addTask(groupId: string) {
    firstValueFrom(this.http.put<Task>(environment.backendUrl + '/task', { groupId, done: false, text: '' }))
      .then(data => {
        const existingData = this.data.value;
        const groupIndex = existingData.findIndex(x => x._id === groupId);
        existingData[groupIndex].tasks.push(data);
        this.data.next(existingData);
      })
      .catch(err => console.error(err));
  }

  public renameGroup(groupName: string, groupId: string) {
    firstValueFrom(this.http.put<TodoGroup>(environment.backendUrl + '/group', { title: groupName, id: groupId }))
      .then(data => {
        const existingData = this.data.value;
        const groupIndex = existingData.findIndex(x => x._id === data._id);
        existingData[groupIndex].title = data.title;
        this.data.next(existingData);
      })
      .catch(err => console.error(err));
  }

  public changeTask(groupId: string, taskId: string, done: boolean, text: string) {
    firstValueFrom(this.http.put<Task>(environment.backendUrl + '/task', { taskId, done, text }))
      .then(data => {
        const existingData = this.data.value;
        const groupIndex = existingData.findIndex(x => x._id === groupId);
        const taskIndex = existingData[groupIndex].tasks.findIndex(x => x._id === data._id);
        existingData[groupIndex].tasks[taskIndex].done = data.done;
        existingData[groupIndex].tasks[taskIndex].title = data.title;
        this.data.next(existingData);
      })
      .catch(err => console.error(err));
  }

  public removeTask(groupdId: string, taskId: string) {
    firstValueFrom(this.http.delete<any>(environment.backendUrl + `/removeTask?id=${taskId}`))
      .then(() => {
        const existingData = this.data.value;
        const groupIndex = existingData.findIndex(x => x._id === groupdId);
        const taskIndex = existingData[groupIndex].tasks.findIndex(x => x._id === taskId);
        existingData[groupIndex].tasks.splice(taskIndex, 1);
        this.data.next(existingData);
      })
      .catch(err => console.error(err));
  }

  public removeGroup(groupId: string) {
    firstValueFrom(this.http.delete<any>(environment.backendUrl + `/removeGroup?id=${groupId}`))
    .then(() => {
      const existingData = this.data.value;
      const groupIndex = existingData.findIndex(x => x._id === groupId);
      existingData.splice(groupIndex, 1);
      this.data.next(existingData);
    })
    .catch(err => console.error(err));
  }

  private getTodos() {
    firstValueFrom(this.http.get<TodoGroup[]>(environment.backendUrl + '/todos'))
      .then(data => {
        this.data.next(data);
      })
      .catch(err => console.error(err));
  }

}
