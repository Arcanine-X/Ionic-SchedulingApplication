import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';

@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
})
export class TaskDetailPage {
  title;
  description;
  date;
  category;
  item;
  key;
  buttonText = "Save";
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public tasksProvier: TasksProvider,
              public view: ViewController,
) {
    this.item = navParams.get('item');
    this.key = navParams.get('key');
    this.title = this.item.taskTitle;
    this.description = this.item.taskDescription;
    this.date = this.item.taskDate;
    this.category = this.item.taskCategory;
  }

  ionViewDidLoad() {
    console.log("Task Details Page Loaded Successfully");
  }

  unsave(){
    this.buttonText = "Click to Save"
  }

  save(){
    this.buttonText = "Saved";
    this.item.taskDate = this.formatDate(this.item.taskDate);
    this.item.taskDescription = this.formatDescription(this.item.taskDescription);
    this.item.taskCategory = this.formatCategory(this.item.taskCategory);
    this.tasksProvier.updateTask(this.key, this.item);
  }

  close(){
    this.view.dismiss();
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
