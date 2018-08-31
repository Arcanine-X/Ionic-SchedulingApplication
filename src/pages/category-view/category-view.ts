import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { TaskDetailPage } from '../task-detail/task-detail';
import { CompletedTasksProvider } from '../../providers/tasks/completedTask';
import { HelpProvider } from '../../providers/helper/helper';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { TaskCreateCategoryPage } from '../task-create-category/task-create-category';

@Component({
  selector: 'page-category-view',
  templateUrl: 'category-view.html',
})
export class CategoryViewPage {
  public categoryName;
  public categoryItems = [];
  public isSearchbarOpened = false;
  public categoriesList = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public tasksProvider : TasksProvider, 
    public completedTasksProvider : CompletedTasksProvider, 
    public helper : HelpProvider, 
    public categoriesProvider : CategoriesProvider) {
    this.categoryName = navParams.get('categoryName');
  }

  ionViewDidLoad() {
    console.log('Category View Loaded');
    //Load in data 
    this.tasksProvider.fetchFilteredData(this.categoryName);
  }

  createTaskInCategory(){
    console.log("Trying to create task");
    this.navCtrl.push(TaskCreateCategoryPage,
      {
        categoryName : this.categoryName
      });
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.categoryItems = this.tasksProvider.getFilteredItems();
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.categoryItems = this.categoryItems.filter((item) => {
        return (item.taskTitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  getFilteredItems(){
    return this.tasksProvider.getFilteredItems();
  }


  /*
  Complete tasks test
  */
 addToCompletedTasks(item){
   this.completedTasksProvider
   .addCompletedTask(item.taskTitle, item.taskDescription, 
     item.taskDate, item.taskCategory, this.helper.getCompletetionTime()).then(newEvent=>{
       this.delete(item.id, item);
     });
}

  delete(key, item){
    this.categoriesList = this.categoriesProvider.getCategoriesArray();
    // update count for items in category in firebase
    let categoryKey = this.helper.findCategoryId(this.categoriesList, item.taskCategory);
    let count  = this.helper.getCategoryCount(this.categoriesList, item.taskCategory);
    count--;
    this.categoriesProvider.updateCategoryCount(categoryKey, count, item.taskCategory);
    //then delete
    this.tasksProvider.deleteTask(key);
  }

  goToTaskDetail(item, itemId){
    this.navCtrl.push(TaskDetailPage, {
      item: item,
      key: itemId
    });
  }
}
