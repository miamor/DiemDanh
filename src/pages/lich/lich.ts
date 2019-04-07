import { Component, ViewChild } from '@angular/core';

import { AlertController, App, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher, NavParams } from 'ionic-angular';

import { AppData } from '../../providers/app-data';

import { LopMonHocDetailPage } from '../lopmonhoc-detail/lopmonhoc-detail';
import { LichHocDetailPage } from '../lichhoc-detail/lichhoc-detail'

@Component({
    selector: 'page-lich',
    templateUrl: 'lich.html'
})
export class LichPage {
    selectedItem: any;
    icons: string[];
    items: Array<{ title: string, note: string, icon: string }>;
    dataList: any;
    shownData = 0;
    userID: any;

    tabID: string;
    tabs = {
        Mon: 'Mon',
        Tue: 'Tue',
        Wed: 'Wed',
        Thu: 'Thu',
        Fri: 'Fri',
        Sat: 'Sat',
        Sun: 'Sun'
    };
    activated = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0
    };


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

    changeTab(id) {
        this.tabID = id;
        for (var _i in this.tabs) {
            if (_i == id) this.activated[_i] = 'active';
            else this.activated[_i] = '';
        }
    }

    updateList(userID) {
        // Close any open sliding items when the tour updates
        this.dataList && this.dataList.closeSlidingItems();

        this.appData.listLopMonHocByUserID_week(userID).subscribe((dataList: any) => {
            this.dataList = dataList;
            console.log(dataList);
            /*for (var tKey in dataList) {
              this.shownData[tKey] = dataList[tKey].length;
            }*/
            this.shownData = dataList.length;
            //console.log(this.shownData);

            var d = new Date();
            var dayName = d.toString().split(' ')[0];
            console.log(dayName);
            this.changeTab(dayName);
        });
    }

    doRefresh(refresher: Refresher) {
        this.appData.listLopMonHocByUserID_week(this.userID).subscribe((dataList: any) => {
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

    ItiDetail(data: any) {
        console.log('ItiDetail called ');

        /*let modal = this.modalCtrl.create(ItineraryPage, { itinerary: this.dataInfo.itinerary, current: current_day });
        modal.present();

        modal.onWillDismiss((data?: any) => {
            if (data) {
                console.log(data);
            }
        });

        modal.onDidDismiss((data?: any) => {
            console.log(data);
            if (data && data != undefined) {
                this.navCtrl.push(TripMyDetailPage, { tripId: data.id, tripInfo: data, name: data.title });
            }
        });*/

        this.appData.loadSinhVienLMH(data.MaLMH).subscribe((dataList: any) => {
            console.log(dataList);

            this.navCtrl.push(LichHocDetailPage, {
                MaLichHoc: data.MaLichHoc,
                dataInfo: data,
                lopInfo: { /*TenLop: data.TenLop, NienKhoa: data.NienKhoa,*/ sinhvien: dataList },
                title: '[' + data.MaLMH + '] ' + data.Ngay
            });
        });

    }

    goToDetail(oneData: any) {
        // go to the tour detail page
        // and pass in the tour data

        this.navCtrl.push(LopMonHocDetailPage, { MaLMH: oneData.MaLMH, dataInfo: oneData, title: '[' + oneData.MaLMH + '] ' + oneData.TenMH });
    }
}
