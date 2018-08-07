import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';

@Component({
  selector: 'page-task-create',
  templateUrl: 'task-create.html',
})
export class TaskCreatePage {
  title: string;
  description: string;

  constructor(public navCtrl: NavController, 
              public view: ViewController,
              public tasksProvider: TasksProvider) {
  }

  ionViewDidLoad() {
    console.log('Task Create Page Successfully Loadd');
  }
 
  close(){
    this.view.dismiss();
  }

  createEvent(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
    taskCategory: string
  ): void {
    //format inputs
    taskDate = this.formatDate(taskDate);
    taskDescription = this.formatDescription(taskDescription);
    taskCategory = this.formatCategory(taskCategory);
    this.tasksProvider
      .createTask(taskTitle, taskDescription, taskDate, taskCategory)
      .then(newEvent => {
        this.navCtrl.pop();
      });
  }


  /*
  * Takes in a date in the format of 2018-08-07 which is converted
  * into 07-08-2018, reversing the date.
  */
  formatDate(date){
    var newDate = date.substring(9,10);
    var year = date.substring(0,4);
    var month = date.substring(5,7);
    var day = date.substring(8,10);
    return day+"-"+month+"-"+year;
  }

  formatDescription(taskDescription){
    if(taskDescription == undefined){
      return " ";
    }
    return taskDescription;
  }

  formatCategory(taskCategory){
    if(taskCategory == undefined){
      return "Default";
    }
    return taskCategory;
  }
}
