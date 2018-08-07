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
    this.tasksProvier.updateTask(this.key, this.item);
  }

  close(){
    this.view.dismiss();
  }
}
