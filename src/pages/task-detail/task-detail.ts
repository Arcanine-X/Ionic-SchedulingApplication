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
  buttonText = "Saved";
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
    this.buttonText = "Save"
  }

  save(){
    this.buttonText = "Saved";
    this.item.taskDate = this.date;
    this.item.taskDate = this.helper.formatDate(this.item.taskDate);
    this.item.taskDescription = this.helper.formatDescription(this.item.taskDescription);
    this.item.taskTitle = this.helper.formatTitle(this.item.taskTitle);
    if(this.newCategory != this.item.taskCategory){
      this.updateNewCategory(this.newCategory);
      this.updateOldCategory(this.item.taskCategory);
    }
    this.item.taskCategory = this.newCategory;//this.formatCategory(this.item.taskCategory);
    this.tasksProvier.updateTask(this.key, this.item);

  }

  updateOldCategory(taskCategory){
        //update old category
        let newCategoryCount = this.helper.getIncreaseCategoryCount(this.categoriesList, taskCategory);
        newCategoryCount--;
        console.log("Category is " + taskCategory + " with " + newCategoryCount + " items");
        newCategoryCount--;
        let categoryId = this.helper.findCategoryId(this.categoriesList, taskCategory);
        this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, taskCategory);
  }

  updateNewCategory(taskCategory){
    //update new category
    let newCategoryCount = this.helper.getIncreaseCategoryCount(this.categoriesList, taskCategory);
    let categoryId = this.helper.findCategoryId(this.categoriesList, taskCategory);
    this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, taskCategory);
  }

  close(){
    this.view.dismiss();
  }
}
