import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserOptions } from '../../interfaces/user-options';

import { AppData } from '../../providers/app-data';
import { LopMonHocPage } from '../lopmonhoc/lopmonhoc';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loginParams: UserOptions = { username: '', password: '' };
    submitted = false;

    constructor(
        public navCtrl: NavController,
        public events: Events,
        public storage: Storage,
        //public userData: UserData
        public appData: AppData
    ) { }

    onLogin(form: NgForm) {
        this.submitted = true;

        if (form.valid) {
            this.appData.login(this.loginParams).subscribe(response => {
                if (response.status == 'success') {
                    this.storage.set('hasLoggedIn', true);

                    this.storage.set('user_info', response.data);

                    console.log(response);

                    this.events.publish('user:login', response.data);

                    //this.navCtrl.push(LopMonHocPage, { gvID: response.data['MaGV'] });
                    //this.navCtrl.push(LopMonHocPage);
                    this.navCtrl.setRoot(LopMonHocPage);
                }
            });
            //this.navCtrl.setRoot(TabsPage);
            //this.navCtrl.push(MonHocDetailPage, { tourId: oneData.id, tourInfo: oneData, name: oneData.title });
        }
    }

}
