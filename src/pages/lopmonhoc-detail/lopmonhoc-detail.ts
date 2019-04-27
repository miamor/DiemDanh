import { Component } from '@angular/core';
import { AlertController, App, List, ModalController, NavController, ToastController, LoadingController, Refresher, NavParams } from 'ionic-angular';
//import { Socket } from 'ng-socket-io';

import { AppData } from '../../providers/app-data';

import { LichHocDetailPage } from '../lichhoc-detail/lichhoc-detail'


@Component({
    selector: 'page-lopmonhoc-detail',
    templateUrl: 'lopmonhoc-detail.html'
})
export class LopMonHocDetailPage {
    dataInfo: any;
    MaLMH: any;
    title: any;

    //sinhvienList: any;
    //lichhocList: any;

    showVbox: { overview: boolean, itinerary: boolean, price: boolean };
    tabID: string;
    tabs = {
        overview: 'Overview',
        lichhoc: 'Lịch học',
        sinhvien: 'Sinh viên'
    };
    activated = {
        overview: 0,
        lichhoc: 0,
        sinhvien: 0
    };

    user_info: any;

    daysName: any = {
        Mon: 'Thứ 2',
        Tue: 'Thứ 3',
        Wed: 'Thứ 4',
        Thu: 'Thứ 5',
        Fri: 'Thứ 6',
        Sat: 'Thứ 7',
        Sun: 'Chủ nhật'
    };

    constructor(
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public appData: AppData
    ) {
        this.showVbox = { overview: true, itinerary: false, price: false };
        //console.log(this.showVbox);

        this.title = this.navParams.data.title;
        this.app.setTitle(this.title);

        this.dataInfo = this.navParams.data.dataInfo;
        this.dataInfo['title'] = this.title;
        this.MaLMH = this.navParams.data.MaLMH;

        this.loadSinhVienLMH();
        this.loadLichHoc();

        //this.myUsername = this.appData.getUsername();
        this.changeTab('overview');
        this.appData.getUserInfo().then((data) => {
            this.user_info = data;
        });
    }

    ionViewWillEnter() {
        /*this.appData.loadTour(this.navParams.data.dataInfoId).subscribe((data: any) => {
            this.dataInfo = data;
            console.log(this.dataInfo);
        });*/
    }

    changeTab(id) {
        this.tabID = id;
        for (var _i in this.tabs) {
            if (_i == id) this.activated[_i] = 'active';
            else this.activated[_i] = '';
        }
    }

    toggleVbox(boxID) {
        this.showVbox[boxID] = !this.showVbox[boxID];
    }


    loadLichHoc() {
        this.appData.loadLichHoc(this.MaLMH).subscribe((dataList: any) => {
            this.dataInfo['lichhoc'] = dataList;
        });
    }

    loadSinhVienLMH() {
        this.appData.loadSinhVienLMH(this.MaLMH).subscribe((dataList: any) => {
            this.dataInfo['sinhvien'] = dataList;
        });
    }

    refresh_lichhoc(refresher: Refresher) {
        this.appData.loadLichHoc(this.MaLMH).subscribe((dataList: any) => {
            this.dataInfo['lichhoc'] = dataList;

            // simulate a network request that would take longer
            // than just pulling from out local json file
            setTimeout(() => {
                refresher.complete();

                const toast = this.toastCtrl.create({
                    message: 'Schedules have been updated.',
                    duration: 3000
                });
                toast.present();
            }, 1000);
        });
    }

    refresh_dssv(refresher: Refresher) {
        this.appData.loadSinhVienLMH(this.MaLMH).subscribe((dataList: any) => {
            this.dataInfo['sinhvien'] = dataList;

            // simulate a network request that would take longer
            // than just pulling from out local json file
            setTimeout(() => {
                refresher.complete();

                const toast = this.toastCtrl.create({
                    message: 'Students list has been updated.',
                    duration: 3000
                });
                toast.present();
            }, 1000);
        });
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

        this.navCtrl.push(LichHocDetailPage, { 
            MaLichHoc: data.MaLichHoc, 
            dataInfo: data, 
            lopInfo: { /*MaLop: this.dataInfo.MaLop,*/ TenLop: this.dataInfo.TenLop, NienKhoa: this.dataInfo.NienKhoa, sinhvien: this.dataInfo['sinhvien'] }, 
            title: '[' + this.dataInfo.MaLMH + '] ' + data.Ngay 
        });
    }

}
