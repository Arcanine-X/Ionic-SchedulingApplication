import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoryViewPage } from '../category-view/category-view';


@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  public categoriesList = [];
  public itemsList = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public tasksProvider : TasksProvider) {
    
  }

  ionViewDidLoad() {
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

    //populate the categories
    this.categoriesList = [];
    for(let i = 0; i < this.itemsList.length; i ++){
      let needle = this.itemsList[i].taskCategory.toLowerCase();
      if(this.categoriesList.indexOf(needle) == -1){
        this.categoriesList.push(needle);
      }
    }
    console.log(this.categoriesList.length);
  }

  openCategory(){
    this.navCtrl.push(CategoryViewPage)
  }
}
