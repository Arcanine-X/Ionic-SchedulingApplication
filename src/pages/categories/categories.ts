import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TasksProvider } from '../../providers/tasks/task';
import { CategoryViewPage } from '../category-view/category-view';
import { CategoriesProvider } from '../../providers/tasks/categories';
import { HelpProvider } from '../../providers/helper/helper';
import { SettingsProvider } from '../../providers/settings/settings';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  public categoriesList = [];
  public itemsList = [];
  public categoryToCreate;
  public categoryAlertToggle;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public tasksProvider: TasksProvider,
    public categoriesProvider: CategoriesProvider,
    public helper: HelpProvider,
    public alertCtrl: AlertController,
    public settingsProvider: SettingsProvider) {
  }

  ionViewDidLoad() {
    console.log("Categories Loaded Successfully");
    this.setCategories();
    this.setSettings();
  }


  setSettings() {
    this.categoryAlertToggle = this.settingsProvider.getCategoryAlertToggle();
  }


  openCategory(categoryName) {
    this.navCtrl.push(CategoryViewPage, {
      categoryName: categoryName
    })
  }

  createNewCategory(category) {
    if (category == undefined) return;
    if (this.isEmpty(category)) return;
    if (this.alreadyContains(category)) return;
    this.categoriesProvider.addCategory(category);
    this.categoryToCreate = "";

  }

  alreadyContains(category) {
    if (this.categoriesList.length == 0) return false
    for (let i = 0; i < this.categoriesList.length; i++) {
      if (this.categoriesList[i].categoryName.toLowerCase() == category.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  getCategories() {
    return this.categoriesProvider.getCategoriesArray();
  }

  setCategories() {
    this.categoriesList = this.categoriesProvider.getCategoriesArray();
    this.helper.sortCategoryNames(this.categoriesList);
  }

  
  getCategoryTaskKeys(category) {
    this.itemsList = this.tasksProvider.getItems();
    let keyList = [];
    for (let i = 0; i < this.itemsList.length; i++) {
      if (this.itemsList[i].taskCategory === category.categoryName) {
        let key = this.itemsList[i].id;
        keyList.push(key);
      }
    }
    this.itemsList = [];
    return keyList;
  }

  deleteCategory(e, category) {
    e.stopPropagation();
    //delete tasks first
    let keyList = this.getCategoryTaskKeys(category);
    this.tasksProvider.deleteCategoryTasks(keyList);
    // then delete category
    this.categoriesProvider.deleteCategory(category.id);
  }

  showConfirm(e, category) {
    e.stopPropagation();
    const confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Are you sure you want to delete the Category? It will delete the tasks contained within it.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteCategory(e, category);
          }
        },
        {
          text: 'No',
          handler: () => {
            return;
          }
        }
      ]
    });
    confirm.present();
  }
}
