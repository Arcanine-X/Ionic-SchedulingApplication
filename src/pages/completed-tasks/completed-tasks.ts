import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, LoadingController, AlertController } from 'ionic-angular';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask'
import { TaskRestorePage } from '../task-restore/task-restore';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { HelpProvider } from '../../providers/helper/helper';

@Component({
  selector: 'page-completed-tasks',
  templateUrl: 'completed-tasks.html',
})
export class CompletedTasksPage {
  //array to store the completed tasks
  categoriesList = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public completedTasksProvider : CompletedTasksProvider, 
              public platform: Platform,
              public actionsheetCtrl: ActionSheetController,
              public tasksProvider: TasksProvider,
              public categoriesProvider : CategoriesProvider,
              public loadingCtrl : LoadingController,
              public alertCtrl: AlertController,
              public helper : HelpProvider) {
  }

  completedItems(){
    return this.completedTasksProvider.getCompletedItems();
  }

  ionViewDidLoad() {
    console.log("Completed Tasks page loaded");
  }

  delete(key){
    this.completedTasksProvider.deleteTask(key);
  }

  restore(item, itemId){
    this.categoriesList = this.categoriesProvider.getCategoriesArray();
    //Recreate the task
    this.tasksProvider.createTask(item.taskTitle,
    item.taskDescription, item.taskDate,
    item.taskCategory).then(newEvent =>{
      this.delete(itemId)
      let newCount = this.helper.getIncreaseCategoryCount(this.categoriesList, item.taskCategory);
      let categoryKey = this.helper.findCategoryId(this.categoriesList, item.taskCategory);
      //Update number of items in the category
      this.categoriesProvider.updateCategoryCount(categoryKey, newCount, item.taskCategory);
    });
  }

  showConfirm(item) {
    const confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Are you sure you want to delete the task?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.delete(item.id);
          }
        },
        {
          text: 'No',
          handler: () => {
            return;
          }
        }
      ]
    });
    confirm.present();
  }

  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskRestorePage, {
      item: item,
      key: itemId
    });
  }
}
