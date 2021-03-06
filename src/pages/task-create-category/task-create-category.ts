import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { HelpProvider } from '../../providers/helper/helper';
import { TasksProvider } from '../../providers/tasks/task';

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
    this.loadCategories();
  }

  close(){
    this.view.dismiss();
  }

  createTask(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
  ): void {
    let newCategoryCount = this.helper.getIncreaseCategoryCount(this.categoriesList, this.categoryName);
    let categoryId = this.helper.findCategoryId(this.categoriesList, this.categoryName);
    //format inputs
    taskDate = this.helper.formatDate(taskDate);
    taskDescription = this.helper.formatDescription(taskDescription);
    taskTitle = this.helper.formatTitle(taskTitle);
    //create the task
    this.tasksProvider
      .createTask(taskTitle, taskDescription, taskDate, this.categoryName)
      .then(newEvent => {
        this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, this.categoryName);
        this.navCtrl.pop();
      });
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
}
