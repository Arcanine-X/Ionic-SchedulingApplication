import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { HelpProvider } from '../../providers/helper/helper';

@Component({
  selector: 'page-task-create',
  templateUrl: 'task-create.html',
})
export class TaskCreatePage {
  title: string;
  description: string;
  itemsList = [];
  categoriesList = [];
  public eventDate:string=new Date().toISOString();
  selectedCategory = "Default";
  constructor(public navCtrl: NavController, 
              public view: ViewController,
              public tasksProvider: TasksProvider,
              public navParams: NavParams,
              public categoriesProvider : CategoriesProvider,
              public helper : HelpProvider) {
              this.itemsList = navParams.get('items');
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

  ionViewDidLoad() {
    console.log('Task Create Page Successfully Loadd');
    this.loadCategories();
  }

  close(){
    this.view.dismiss();
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


  createEvent(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
    taskCategory: string
  ): void {
    let newCategoryCount = this.findCategoryCount(taskCategory);
    let categoryId = this.findCategoryId(taskCategory);
    //format inputs
    taskDate = this.formatDate(taskDate);
    taskDescription = this.formatDescription(taskDescription);
    taskCategory = this.formatCategory(taskCategory);
    this.tasksProvider
      .createTask(taskTitle, taskDescription, taskDate, taskCategory)
      .then(newEvent => {
        this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, taskCategory);
        this.navCtrl.pop();
      });
  }

  /*
  * Takes in a date in the format of 2018-08-07 which is converted
  * into 07-08-2018, reversing the date.
  */
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
