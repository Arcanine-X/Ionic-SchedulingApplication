import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { ProfileProvider } from '../providers/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { CategoriesPage } from '../pages/categories/categories';
import { CompletedTasksPage } from '../pages/completed-tasks/completed-tasks';
import { TaskCreatePage } from '../pages/task-create/task-create';
import { TaskDetailPage } from '../pages/task-detail/task-detail';
import { TasksProvider } from '../providers/tasks/task';
import { CompletedTasksProvider } from '../providers/tasks/completedTask';
import { TaskRestorePage } from '../pages/task-restore/task-restore';
import { CategoryViewPage } from '../pages/category-view/category-view';
import { IonTextAvatar } from 'ionic-text-avatar';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    SettingsPage,
    CategoriesPage,
    CompletedTasksPage,
    TaskCreatePage,
    TaskDetailPage,
    TaskRestorePage,
    CategoryViewPage,
    IonTextAvatar
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    SettingsPage,
    CategoriesPage,
    CompletedTasksPage,
    TaskCreatePage,
    TaskDetailPage,
    TaskRestorePage,
    CategoryViewPage,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ProfileProvider,
    TasksProvider,
    CompletedTasksProvider
  ]
})
export class AppModule {}
