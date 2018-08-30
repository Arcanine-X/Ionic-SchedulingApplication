import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask';
import { CompletedTasksPage } from '../completed-tasks/completed-tasks';

@Component({
  selector: 'page-task-restore',
  templateUrl: 'task-restore.html',
})
export class TaskRestorePage {
  item;
  itemId;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public tasksProvider: TasksProvider,
              public completedTasksProvider: CompletedTasksProvider) {
      this.item = navParams.get('item');
      this.itemId = this.item.itemId;
  }

  ionViewDidLoad() {
    console.log("Task restore page successfully loaded");
  }

  restore(){
    this.tasksProvider.createTask(this.item.taskTitle,
    this.item.taskDescription, this.item.taskDate,
    this.item.taskCategory).then(newEvent =>{
      this.delete(this.item.id)
    });
    //Take it back to the completed tasks page after task has been restored and deleted from completed tasks
    this.navCtrl.setRoot(CompletedTasksPage);
  }

  delete(key){
    this.completedTasksProvider.deleteTask(key);
  }
}
