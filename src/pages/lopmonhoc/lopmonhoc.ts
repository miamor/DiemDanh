import { Component, ViewChild } from '@angular/core';

import { AlertController, App, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';

import { LopMonHocDetailPage } from '../lopmonhoc-detail/lopmonhoc-detail';

@Component({
    selector: 'page-lopmonhoc',
    templateUrl: 'lopmonhoc.html'
})
export class LopMonHocPage {
    selectedItem: any;
    icons: string[];
    items: Array<{ title: string, note: string, icon: string }>;
    dataList: any;
    shownData = 0;
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

        public appData: AppData
    ) {
        this.appData.getUserInfoPromise().then((data) => {
            this.userID = data['MaGV'];
            console.log(this.userID);
            this.updateList(this.userID);
        });
    }

    ionViewDidLoad() {
        //if (this.userID) {}
        
    }

    updateList(userID) {
        // Close any open sliding items when the tour updates
        this.dataList && this.dataList.closeSlidingItems();

        this.appData.listLopMonHocByUserID(userID).subscribe((dataList: any) => {
            this.dataList = dataList;
            console.log(dataList);
            /*for (var tKey in dataList) {
              this.shownData[tKey] = dataList[tKey].length;
            }*/
            this.shownData = dataList.length;
            //console.log(this.shownData);
        });
    }

    doRefresh(refresher: Refresher) {
        this.appData.listLopMonHocByUserID().subscribe((dataList: any) => {
            this.dataList = dataList;
            /*for (var tKey in dataList) {
              this.shownData[tKey] = dataList[tKey].length;
            }*/
            this.shownData = dataList.length;

            // simulate a network request that would take longer
            // than just pulling from out local json file
            setTimeout(() => {
                refresher.complete();

                const toast = this.toastCtrl.create({
                    message: 'List have been updated.',
                    duration: 3000
                });
                toast.present();
            }, 1000);
        });
    }

    presentFilter() {
        console.log(this.params);
        /*let modal = this.modalCtrl.create(TourFilterPage, { params: this.params });
        modal.present();
    
        modal.onWillDismiss((data: any[]) => {
          if (data) {
            //this.excludeTypeIds = data;
            this.updateList();
          }
        });
    
        modal.onDidDismiss((data?: any) => {
          if (data && data != undefined) {
            console.log('Now search with these filter settings');
            console.log(data);
            this.params = data.params;
            //this.navCtrl.push(TourListPage, { data });
            this.updateList();
          }
        });*/
    }

    goToDetail(oneData: any) {
        // go to the tour detail page
        // and pass in the tour data

        this.navCtrl.push(LopMonHocDetailPage, { MaLMH: oneData.MaLMH, dataInfo: oneData, title: '['+oneData.MaLMH+'] '+oneData.TenMH });
    }
}
