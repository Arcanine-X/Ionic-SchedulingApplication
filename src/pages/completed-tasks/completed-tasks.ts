import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask'
import { TaskRestorePage } from '../task-restore/task-restore';

/**
 * Generated class for the CompletedTasksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-completed-tasks',
  templateUrl: 'completed-tasks.html',
})
export class CompletedTasksPage {

  //array to store the completed tasks
  public completedItems = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public completedTasksProvider : CompletedTasksProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompletedTasksPage');
    this.completedTasksProvider.completedTasksRef.on("value", eventListSnapshot => {
      this.completedItems = [];
      eventListSnapshot.forEach(snap => {
        this.completedItems.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
        return false;
      });
    });
  }


  goToTaskDetail(item, itemId){
    console.log("Item ID is: " + itemId);
    this.navCtrl.push(TaskRestorePage, {
      item: item,
      key: itemId
    });
  }



}
