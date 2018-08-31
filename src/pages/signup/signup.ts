import { Component } from "@angular/core";
import {
  Alert,
  AlertController,
  Loading,
  LoadingController,
  NavController
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { EmailValidator } from "../../validators/email";
import { CategoriesProvider } from "../../providers/tasks/categories";
import { TabsPage } from "../tabs/tabs";
import { SettingsProvider } from "../../providers/settings/settings";
/*
* I followed through this tutorial to help me get my signup sorted: https://javebratt.com/ionic-firebase-authentication/
*/
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  public signupForm: FormGroup;
  public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public categoriesProvider: CategoriesProvider,
    public settingsProvider : SettingsProvider,
    formBuilder: FormBuilder
  ) {
    this.signupForm = formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }
  signupUser(): void {
    if (!this.signupForm.valid) {
      console.log(
        `Need to complete the form, current value: ${this.signupForm.value}`
      );
    } else {
      const email: string = this.signupForm.value.email;
      const password: string = this.signupForm.value.password;

      this.authProvider.signupUser(email, password).then(
        user => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(TabsPage);
            this.categoriesProvider.addCategory("Default");
            this.categoriesProvider.addCategory("Home");
            this.categoriesProvider.addCategory("Work");
            this.categoriesProvider.addCategory("Travel");
            this.categoriesProvider.addCategory("Important");
            this.settingsProvider.setDefaultSettings();
          });
        },
        error => {
          this.loading.dismiss().then(() => {
            const alert: Alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: "Ok", role: "cancel" }]
            });
            alert.present();
          });
        }
      );
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }
  }
}