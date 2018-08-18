import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { HelpProvider } from '../../providers/helper/helper';
import { CategoriesProvider } from '../../providers/tasks/categories';

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
  categoriesList = [];
  newCategory;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public tasksProvier: TasksProvider,
              public view: ViewController,
              public helper: HelpProvider,
              public categoriesProvider : CategoriesProvider
) {
  
    this.item = navParams.get('item');
    this.key = navParams.get('key');
    this.title = this.item.taskTitle;
    this.description = this.item.taskDescription;
    this.date = new Date(this.dateStructure(this.item.taskDate)).toISOString();
    this.category = this.item.taskCategory;
    this.newCategory = this.item.taskCategory;
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
    this.loadCategories();
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
    if(this.newCategory != this.item.taskCategory){
      this.updateNewCategory(this.newCategory);
      this.updateOldCategory(this.item.taskCategory);
    }
    this.item.taskCategory = this.newCategory;//this.formatCategory(this.item.taskCategory);
    this.tasksProvier.updateTask(this.key, this.item);

  }

  updateOldCategory(taskCategory){
        //update old category
        let newCategoryCount = this.findCategoryCount(taskCategory);
        newCategoryCount--;
        console.log("Category is " + taskCategory + " with " + newCategoryCount + " items");
        newCategoryCount--;
        let categoryId = this.findCategoryId(taskCategory);
        this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, taskCategory);
  }

  updateNewCategory(taskCategory){

    //update new category
    let newCategoryCount = this.findCategoryCount(taskCategory);
    let categoryId = this.findCategoryId(taskCategory);
    this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, taskCategory);

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
