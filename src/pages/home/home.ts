import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    user_info: any;

    constructor(
        public navParams: NavParams,
        public app: App,
        public navCtrl: NavController,
        public appData: AppData
    ) {

    this.appData.getUserInfo().then((data) => {
        console.log(data);
        this.user_info = data;
    });


  }

}
