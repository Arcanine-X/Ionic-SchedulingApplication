import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask'
import { TaskRestorePage } from '../task-restore/task-restore';
import { TasksProvider } from '../../providers/tasks/task';

@Component({
  selector: 'page-completed-tasks',
  templateUrl: 'completed-tasks.html',
})
export class CompletedTasksPage {

  //array to store the completed tasks
  public completedItems = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public completedTasksProvider : CompletedTasksProvider, 
              public platform: Platform,
              public actionsheetCtrl: ActionSheetController,
              public tasksProvider: TasksProvider) {
  }

  ionViewDidLoad() {
    console.log('Completed Tasks loaded Successfully');
    this.completedTasksProvider.completedTasksRef.on("value", eventListSnapshot => {
      this.completedItems = [];
      eventListSnapshot.forEach(snap => {
        this.completedItems.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory,
          taskCompletionTime: snap.val().taskCompletionTime
        });
        return false;
      });
    });
  }


  delete(key){
    this.completedTasksProvider.deleteTask(key);
  }

  restore(item, itemId){
    this.tasksProvider.createTask(item.taskTitle,
    item.taskDescription, item.taskDate,
    item.taskCategory).then(newEvent =>{
    this.delete(itemId)
  });
    
  }

  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskRestorePage, {
      item: item,
      key: itemId
    });
  }

}
