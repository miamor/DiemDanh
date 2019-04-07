import { Component } from '@angular/core';
import { AlertController, App, List, ModalController, NavController, ToastController, LoadingController, Refresher, NavParams } from 'ionic-angular';
//import { Socket } from 'ng-socket-io';

import { AppData } from '../../providers/app-data';

@Component({
    selector: 'page-lichhoc-detail',
    templateUrl: 'lichhoc-detail.html'
})
export class LichHocDetailPage {
    CTDD: any;

    dataInfo: any;
    MaLop: any;
    title: any;
    lopInfo: any;

    tabID: string;
    tabs = {
        about: 'About',
        sinhvien: 'Điểm danh'
    };
    activated = {
        about: 0,
        sinhvien: 0
    };

    user_info: any;

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
        this.CTDD = [];

        this.title = this.navParams.data.title;
        this.app.setTitle(this.title);

        this.dataInfo = this.navParams.data.dataInfo;
        console.log(this.dataInfo);
        this.dataInfo['title'] = this.title;
        this.lopInfo = this.navParams.data.lopInfo;

        if (this.dataInfo.DaDiemDanh == true) {
            this.updateCTDD();
        } else {
            for (let i = 0; i < this.lopInfo.sinhvien.length; i++) {
                let maSV = this.lopInfo.sinhvien[i].MaSV;
                this.CTDD[i] = {
                    MaSV: maSV,
                    TrangThai: 0,
                    GhiChu: ''
                }
            }
        }

        this.changeTab('about');

        this.appData.getUserInfo().then((data) => {
            this.user_info = data;
        });
    }

    updateCTDD() {
        this.appData.getChiTietDiemDanh(this.dataInfo.MaLichHoc).subscribe((data: any) => {
            this.CTDD = data;
        });
    }

    changeTab(id) {
        this.tabID = id;
        for (var _i in this.tabs) {
            if (_i == id) this.activated[_i] = 'active';
            else this.activated[_i] = '';
        }
    }

    doRefresh(refresher: Refresher) {
        //console.log(this.dataInfo.MaLichHoc);
        this.appData.getChiTietDiemDanh(this.dataInfo.MaLichHoc).subscribe((data: any) => {
            if (data != null && data.length > 0) {
                this.dataInfo.DaDiemDanh == true
                this.CTDD = data;

                // simulate a network request that would take longer
                // than just pulling from out local json file
                setTimeout(() => {
                    refresher.complete();

                    const toast = this.toastCtrl.create({
                        message: 'Updated.',
                        duration: 3000
                    });
                    toast.present();
                }, 1000);
            }
        });
    }


    ionViewWillEnter() {
        /*this.appData.loadTour(this.navParams.data.dataInfoId).subscribe((data: any) => {
            this.dataInfo = data;
            console.log(this.dataInfo);
        });*/
    }


    DiemDanh_popup(index: number, sv: any, showComat: boolean = true) {
        let inputsRadio = [
            {
                name: 'stt',
                type: 'radio',
                label: 'Có mặt',
                value: '1',
                checked: this.CTDD[index].TrangThai == 1
            },
            {
                name: 'stt',
                type: 'radio',
                label: 'Vắng phép',
                value: '-1',
                checked: this.CTDD[index].TrangThai == -1
            },
            {
                name: 'stt',
                type: 'radio',
                label: 'Vắng không phép',
                value: '-2',
                checked: this.CTDD[index].TrangThai == -2
            }
        ];
        if (showComat == false) {
            inputsRadio = [
                {
                    name: 'stt',
                    type: 'radio',
                    label: 'Vắng phép',
                    value: '-1',
                    checked: this.CTDD[index].TrangThai == -1
                },
                {
                    name: 'stt',
                    type: 'radio',
                    label: 'Vắng không phép',
                    value: '-2',
                    checked: this.CTDD[index].TrangThai == -2
                }
            ]
        }
        let alert = this.alertCtrl.create({
            title: sv.HoTen,
            message: 'Mã SV: ' + sv.MaSV + '<br/>Ngày sinh: ' + sv.NgaySinh,
            inputs: inputsRadio,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        //console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: (data: any) => {
                        //console.log(data);

                        let submitData = {
                            MaSV: sv.MaSV,
                            TrangThai: parseInt(data),
                            GhiChu: ''
                        };
                        if (data < 0) {
                            let alertNote = this.alertCtrl.create({
                                title: 'Ghi chú',
                                message: 'Mã SV: ' + sv.MaSV + '<br/>Ngày sinh: ' + sv.NgaySinh,
                                inputs: [
                                    {
                                        name: 'note',
                                        type: 'text',
                                        placeholder: 'Ghi chú'
                                    }
                                ],
                                buttons: [
                                    {
                                        text: 'Skip',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                    }, {
                                        text: 'Ok',
                                        handler: (datan: any) => {
                                            submitData.GhiChu = datan.note;
                                        }
                                    }
                                ]
                            });
                            alertNote.present();

                        }
                        //this.CTDD.push(submitData);
                        //this.CTDD[sv.MaSV] = submitData;
                        this.CTDD[index] = submitData;
                    }
                }
            ]
        });

        alert.present();

        /*let modal = this.modalCtrl.create(DiemDanhPage, { sv: sv });
        modal.present();

        modal.onWillDismiss((data?: any) => {
            if (data) {
                console.log(data);
            }
        });

        modal.onDidDismiss((data?: any) => {
            console.log(data);
        });*/


    }


    DiemDanh(index: number, sv: any, type: number) {
        let submitData = {
            MaSV: sv.MaSV,
            TrangThai: type,
            GhiChu: ''
        };

        let alertNote = this.alertCtrl.create({
            title: 'Ghi chú',
            message: 'Mã SV: ' + sv.MaSV + '<br/>Ngày sinh: ' + sv.NgaySinh,
            inputs: [
                {
                    name: 'note',
                    type: 'text',
                    placeholder: 'Ghi chú'
                }
            ],
            buttons: [
                {
                    text: 'Skip',
                    role: 'cancel',
                    cssClass: 'secondary',
                }, {
                    text: 'Ok',
                    handler: (datan: any) => {
                        submitData.GhiChu = datan.note;
                    }
                }
            ]
        });
        alertNote.present();

        this.CTDD[index] = submitData;
    }

    swipeEvent($e, index: number, sv: any) {
        if (this.dataInfo.DaDiemDanh == true) return;

        let status = 0;
        //console.log($e);
        //let cPointer = $e.changedPointers[0];
        if ($e.offsetDirection == 4) { // left to right (co mat)
            let submitData = {
                MaSV: sv.MaSV,
                TrangThai: 1,
                GhiChu: ''
            };

            this.CTDD[index] = submitData;
            //console.log(this.CTDD);
        } else if ($e.offsetDirection == 2) { // right to left
            this.DiemDanh_popup(index, sv, false)
        }

    }

    saveDiemDanh() {
        let cday = new Date().toJSON().slice(0, 10);
        console.log({ MaLichHoc: this.dataInfo.MaLichHoc, NgayDiemDanh: cday, MaGV: this.user_info['MaGV'], CTDD: this.CTDD });
        this.appData.submitDiemDanh({ MaLichHoc: this.dataInfo.MaLichHoc, NgayDiemDanh: cday, MaGV: this.user_info['MaGV'], CTDD: this.CTDD }).subscribe((data: any) => {
            console.log('Done!!');
            console.log(data);
            this.dataInfo.DaDiemDanh = true;
            this.updateCTDD();
        });
    }

}
