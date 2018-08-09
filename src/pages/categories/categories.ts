import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoryViewPage } from '../category-view/category-view';
import { CategoriesProvider } from '../../providers/tasks/categories';

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
              public loadingCtrl : LoadingController) {    
  }

  ionViewDidLoad(){
    this.doLoad();
    this.loadCategories();
  }




  /*
  Selection sorts by a natural sort of alphanumerical strings
  */
  selectionSort(arr){
    let i,m,j;
    for (i = -1; ++i < arr.length;) {
      for (m = j = i; ++j < arr.length;) {
        if (this.selectionSortComparator(arr[m].categoryName, arr[j].categoryName)) m = j;
      }
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  /*
  Comparator method for selection sort using localeCompare. By passing the
  numeric: true option, it will smartly recognize numbers. You can do case-insensitive using sensitivity: 'base'
  */
  selectionSortComparator(a, b) {
    var arr = [];
    arr.push(a);
    arr.push(b);
    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    arr.sort(collator.compare);
    if (arr[0] == a) {
      return false;
    } else {
      return true;
    }
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
    console.log("TECST " + this.categoriesList[0].categoryName);
    for(let i = 0; i < this.categoriesList.length; i ++){
      if(this.categoriesList[i].categoryName.toLowerCase() == category.toLowerCase()){
        console.log("Returned true");
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
      this.selectionSort(this.categoriesList);
      self.loader.dismiss();
    });
    
  }

  deleteCategory(){
    console.log("in delete category");
  }
}
