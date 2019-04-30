import { Component } from '@angular/core';

import { AlertController, App, ViewController, ModalController, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';

@Component({
    selector: 'page-import-detail',
    templateUrl: 'import-detail.html'
})
export class ImportDetailPage {
    data: any;
    userID: any;

    params = {
        name: ''
    };

    constructor(
        public alertCtrl: AlertController,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,

        public appData: AppData
    ) {
        this.data = this.navParams.get('data');
        console.log(this.data)
        this.appData.getUserInfoPromise().then((data) => {
            this.userID = data['MaGV'];
            console.log(this.userID);
        });
    }

    dismiss(data?: any) {
        this.viewCtrl.dismiss(data);
    }

    import() {
        this.viewCtrl.dismiss({data: this.data});
    }

}
