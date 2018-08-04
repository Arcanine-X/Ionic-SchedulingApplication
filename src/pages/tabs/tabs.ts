import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
import { CategoriesPage } from '../categories/categories';
import { CompletedTasksPage } from '../completed-tasks/completed-tasks';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CategoriesPage;
  tab3Root = CompletedTasksPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
