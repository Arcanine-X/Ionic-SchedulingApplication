import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public tasksProvider : TasksProvider,
              public categoriesProvider : CategoriesProvider) {    
  }

  ionViewDidLoad(){
    this.loadCategories();
  }

  /*
  Selection sorts by a natural sort of alphanumerical strings
  */
  selectionSort(arr){
    let i,m,j;
    for (i = -1; ++i < arr.length;) {
      for (m = j = i; ++j < arr.length;) {
        if (this.selectionSortComparator(arr[m].title, arr[j].title)) m = j;
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
    if(category == undefined) return false;
    if(this.isEmpty(category)) return false;
    this.categoriesProvider.addCategory(category);
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  loadCategories(){
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
    });
  }
}
