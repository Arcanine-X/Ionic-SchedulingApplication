import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, LoadingController, AlertController } from 'ionic-angular';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask'
import { TaskRestorePage } from '../task-restore/task-restore';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { SettingsProvider } from '../../providers/settings/settings';

@Component({
  selector: 'page-completed-tasks',
  templateUrl: 'completed-tasks.html',
})
export class CompletedTasksPage {

  //array to store the completed tasks
  public completedItems = [];
  private loader;
  public taskAlertToggle;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public completedTasksProvider : CompletedTasksProvider, 
              public platform: Platform,
              public actionsheetCtrl: ActionSheetController,
              public tasksProvider: TasksProvider,
              public categoriesProvider : CategoriesProvider,
              public loadingCtrl : LoadingController,
              public alertCtrl: AlertController,
              public settingsProvider: SettingsProvider) {
  }

  ionViewDidLoad() {
    this.doLoad();
    console.log('Completed Tasks loaded Successfully');
    let self = this;
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
      });
      self.loader.dismiss();
    });
    this.loadCategories();
    this.loadSettings();
  }

  loadSettings(){
    this.settingsProvider.getSettings().on("value", setting => {
      setting.forEach(snap => {
        this.taskAlertToggle = snap.val().taskAlertToggle
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
    let newCount = this.findCategoryCount(item.taskCategory);
    let categoryKey = this.findCategoryId(item.taskCategory);
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

  findCategoryCount(categoryName : string){
    for(let i = 0; i < this.categoriesList.length; i++){
      if(this.categoriesList[i].categoryName === categoryName){
        let original = this.categoriesList[i].categoryCount;
        return original + 1;
      }
    }
    return 0;
  }


  findCategoryId(categoryName : string){
    for(let i = 0;i < this.categoriesList.length; i++){
      if(this.categoriesList[i].categoryName === categoryName){
        return this.categoriesList[i].id;
      }
    }
  }

  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskRestorePage, {
      item: item,
      key: itemId
    });
  }
  categoriesList = [];

  loadCategories(){
    this.categoriesProvider.getCategories().on("value", categoriesList => {
      this.categoriesList = [];
      categoriesList.forEach(snap => {
        this.categoriesList.push({
          id: snap.key,
          categoryName: snap.val().categoryName,
          categoryCount: snap.val().categoryCount
        });
        //return false;
      });
    });

  }

  doLoad(){
    this.loader = this.loadingCtrl.create(
      {
        content: "Please wait...",
      }
    );
    this.loader.present();
  }


}
