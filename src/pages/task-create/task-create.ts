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

  createEvent(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
    taskCategory: string
  ): void {
    let newCategoryCount = this.helper.getIncreaseCategoryCount(this.categoriesList, taskCategory);
    let categoryId = this.helper.findCategoryId(this.categoriesList, taskCategory);
    //format inputs
    taskTitle = this.helper.formatTitle(taskTitle);
    taskDate = this.helper.formatDate(taskDate);
    taskDescription = this.helper.formatDescription(taskDescription);
    taskCategory = this.helper.formatCategory(taskCategory);
    this.tasksProvider
      .createTask(taskTitle, taskDescription, taskDate, taskCategory)
      .then(newEvent => {
        this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, taskCategory);
        this.navCtrl.pop();
      });
  }
}
