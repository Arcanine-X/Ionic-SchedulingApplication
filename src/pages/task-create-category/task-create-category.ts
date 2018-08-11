import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { HelpProvider } from '../../providers/helper/helper';
import { TasksProvider } from '../../providers/tasks/task';

/**
 * Generated class for the TaskCreateCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-task-create-category',
  templateUrl: 'task-create-category.html',
})
export class TaskCreateCategoryPage {
  private categoryName;
  categoriesList = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController,
              public categoriesProvider : CategoriesProvider,
              public helper : HelpProvider,
              public tasksProvider: TasksProvider,              
            ) {
    this.categoryName = navParams.get('categoryName');
  }

  ionViewDidLoad() {
    console.log('Loaded Create Task In Category Page Successfully');
    this.loadCategories();

  }

  close(){
    this.view.dismiss();
  }


  createEvent(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
  ): void {
    let newCategoryCount = this.findCategoryCount(this.categoryName);
    let categoryId = this.findCategoryId(this.categoryName);
    //format inputs
    taskDate = this.formatDate(taskDate);
    taskDescription = this.formatDescription(taskDescription);
    this.tasksProvider
      .createTask(taskTitle, taskDescription, taskDate, this.categoryName)
      .then(newEvent => {
        this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, this.categoryName);
        this.navCtrl.pop();
      });
  }

  formatDescription(taskDescription){
    if(taskDescription == undefined){
      return " ";
    }
    return taskDescription;
  }


  formatDate(date){
    if(date == undefined){
      return this.helper.getTodaysDate();
    }
    var newDate = date.substring(9,10);
    var year = date.substring(0,4);
    var month = date.substring(5,7);
    var day = date.substring(8,10);
    return day+"-"+month+"-"+year;
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
      this.helper.sortCategoryNames(this.categoriesList);
    });
  }


}
