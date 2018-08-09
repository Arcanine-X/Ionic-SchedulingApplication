import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, LoadingController } from 'ionic-angular';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask'
import { TaskRestorePage } from '../task-restore/task-restore';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoriesProvider } from '../../providers/tasks/categories';

@Component({
  selector: 'page-completed-tasks',
  templateUrl: 'completed-tasks.html',
})
export class CompletedTasksPage {

  //array to store the completed tasks
  public completedItems = [];
  private loader;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public completedTasksProvider : CompletedTasksProvider, 
              public platform: Platform,
              public actionsheetCtrl: ActionSheetController,
              public tasksProvider: TasksProvider,
              public categoriesProvider : CategoriesProvider,
              public loadingCtrl : LoadingController) {
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
    console.log("IN ID " + categoryName);
    for(let i = 0;i < this.categoriesList.length; i++){
      if(this.categoriesList[i].categoryName === categoryName){
        console.log("in here??? ffs");
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
        console.log("got close");
        console.log(snap.key);
        console.log(snap.val().categoryName);
        this.categoriesList.push({
          id: snap.key,
          categoryName: snap.val().categoryName,
          categoryCount: snap.val().categoryCount
        });
        console.log("pushed i guess");
        console.log(this.categoriesList.length);
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
