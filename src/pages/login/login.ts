import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserOptions } from '../../interfaces/user-options';

import { AppData } from '../../providers/app-data';
import { LopMonHocPage } from '../lopmonhoc/lopmonhoc';
import { HomePage } from '../home/home';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loginParams: UserOptions = { username: '', password: '' };
    submitted = false;
    userID: any;

    constructor(
        public navCtrl: NavController,
        public events: Events,
        public storage: Storage,
        //public userData: UserData
        public appData: AppData,
        public toastCtrl: ToastController,
    ) { 
        this.appData.getUserInfoPromise().then((data) => {
            if (data) {
                this.userID = data['MaSV'];
                this.navCtrl.setRoot(HomePage);
            }
        });

    }

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
                    this.navCtrl.setRoot(HomePage);
                } else {
                    setTimeout(() => {
                        
                        const toast = this.toastCtrl.create({
                            message: response.msg,
                            duration: 3000
                        });
                        toast.present();
                    }, 100);
                }
            });
            //this.navCtrl.setRoot(TabsPage);
            //this.navCtrl.push(MonHocDetailPage, { tourId: oneData.id, tourInfo: oneData, name: oneData.title });
        }
    }

}
