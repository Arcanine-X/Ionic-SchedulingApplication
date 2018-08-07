import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { TaskDetailPage } from '../task-detail/task-detail';


@Component({
  selector: 'page-category-view',
  templateUrl: 'category-view.html',
})
export class CategoryViewPage {
  public categoryName;
  public itemsList = [];
  public categoryItems = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public tasksProvider : TasksProvider) {
    this.categoryName = navParams.get('categoryName');
    this.populate();
  }

  ionViewDidLoad() {
    console.log('Category View Loaded');
  }

  populate(){
    //get all the items
    this.tasksProvider.getTasksList().on("value", eventListSnapshot => {
      this.itemsList = [];
      eventListSnapshot.forEach(snap => {
        this.itemsList.push({
          id: snap.key,
          taskTitle: snap.val().taskTitle,
          taskDescription: snap.val().taskDescription,
          taskDate: snap.val().taskDate,
          taskCategory: snap.val().taskCategory
        });
      });
    });

    //filter items to get specific category
    for(let i = 0; i < this.itemsList.length; i++){
      if(this.itemsList[i].taskCategory.toLowerCase() === this.categoryName.toLowerCase()){
        this.categoryItems.push(this.itemsList[i]);
      }
    }
  }

  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskDetailPage, {
      item: item,
      key: itemId
    });
  }
}
