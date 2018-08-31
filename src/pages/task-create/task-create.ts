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
  public title: string;
  public description: string;
  public itemsList = [];
  public categoriesList = [];
  public eventDate: string = new Date().toISOString();
  public selectedCategory = "Default";
  
  constructor(public navCtrl: NavController,
    public view: ViewController,
    public tasksProvider: TasksProvider,
    public navParams: NavParams,
    public categoriesProvider: CategoriesProvider,
    public helper: HelpProvider) {
    this.itemsList = navParams.get('items');
  }

  loadCategories() {
    this.categoriesList = this.categoriesProvider.getCategoriesArray();
    this.helper.sortCategoryNames(this.categoriesList);
  }

  ionViewDidLoad() {
    console.log('Task Create Page Successfully Loadd');
    this.loadCategories();
  }

  close() {
    this.view.dismiss();
  }

  createTask(
    taskTitle: string,
    taskDescription: string,
    taskDate: string,
    taskCategory: string
  ): void {
    this.categoriesList = this.categoriesProvider.getCategoriesArray();
    let newCategoryCount = this.helper.getIncreaseCategoryCount(this.categoriesList, taskCategory);
    let categoryId = this.helper.findCategoryId(this.categoriesList, taskCategory);
    //format inputs
    taskTitle = this.helper.formatTitle(taskTitle);
    taskDate = this.helper.formatDate(taskDate);
    taskDescription = this.helper.formatDescription(taskDescription);
    taskCategory = this.helper.formatCategory(taskCategory);
    //create the task
    this.tasksProvider
      .createTask(taskTitle, taskDescription, taskDate, taskCategory)
      .then(newEvent => {
        this.categoriesProvider.updateCategoryCount(categoryId, newCategoryCount, taskCategory);
        this.navCtrl.pop();
      });
  }
}
