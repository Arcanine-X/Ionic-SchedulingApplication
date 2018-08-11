import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoryViewPage } from '../category-view/category-view';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { HelpProvider } from '../../providers/helper/helper';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  public categoriesList = [];
  public itemsList = [];
  loader;
  categoryToCreate;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public tasksProvider : TasksProvider,
              public categoriesProvider : CategoriesProvider,
              public loadingCtrl : LoadingController,
              public helper : HelpProvider) {    
  }

  ionViewDidLoad(){
    this.doLoad();
    this.loadCategories();
  }


  openCategory(categoryName){
    this.navCtrl.push(CategoryViewPage, {
      categoryName : categoryName
    })
  }

  doSomething(category){
    if(category == undefined) return;
    if(this.isEmpty(category)) return;
    if(this.alreadyContains(category)) return; 
    this.categoriesProvider.addCategory(category);
    this.categoryToCreate = "";

  }

  alreadyContains(category){
    if(this.categoriesList.length == 0) return false
    for(let i = 0; i < this.categoriesList.length; i ++){
      if(this.categoriesList[i].categoryName.toLowerCase() == category.toLowerCase()){
        return true;
      }
    }
    return false;
  }


  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  doLoad(){
    this.loader = this.loadingCtrl.create(
      {
        content: "Please wait...",
      }
    );
    this.loader.present();
  }

  loadCategories(){
    let self = this;
    this.categoriesProvider.getCategories().on("value", categoriesList => {
      this.categoriesList = [];
      categoriesList.forEach(snap => {
        this.categoriesList.push({
          id: snap.key,
          categoryName: snap.val().categoryName,
          categoryCount: snap.val().categoryCount,
          categoryLetter : snap.val().categoryLetter
        });
      });
      this.helper.sortCategoryNames(this.categoriesList);
      self.loader.dismiss();
    });
  }


  getCategoryTaskKeys(category){
    this.loadItems();
    let keyList = [];
    for(let i = 0; i < this.itemsList.length; i++){
      if(this.itemsList[i].taskCategory === category.categoryName){
        let key = this.itemsList[i].id;
        keyList.push(key);
      }
    }
    this.itemsList = [];
    return keyList;
  }



  deleteCategory(e, category){
    e.stopPropagation();
    //delete tasks first
    let keyList = this.getCategoryTaskKeys(category);
    this.tasksProvider.deleteCategoryTasks(keyList);
    // then delete category
    this.categoriesProvider.deleteCategory(category.id);
  }

  loadItems(){
    //this.doLoad();
    this.tasksProvider.getTasksList().on("value", tasksList => {
      this.itemsList = [];
      tasksList.forEach(snap => {
        this.itemsList.push({
          id: snap.key,
          taskCategory: snap.val().taskCategory
        });
        return false;
      });
    });
  }
}
