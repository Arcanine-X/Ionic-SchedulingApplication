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
    this.date = new Date(this.dateStructure(this.item.taskDate)).toISOString();
    this.category = this.item.taskCategory;
  }

  ionViewDidLoad() {

  }

  dateStructure(date){
    var split = date.split('-');
    return split[2] + "-" + split[1] + "-" +split[0];
  }



  unsave(){
    this.buttonText = "Click to Save"
  }

  save(){
    this.buttonText = "Saved";
    this.item.taskDate = this.date;
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
   let split_hhmmss = date.split('T'); //split hh:mm:ss
   let split = split_hhmmss[0].split('-'); //split yyyy-mm-dd
   return split[2] + "-" + split[1] + "-" +split[0];
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
