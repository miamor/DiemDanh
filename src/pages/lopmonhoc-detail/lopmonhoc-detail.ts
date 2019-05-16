import { Component } from '@angular/core';
import { AlertController, App, List, ModalController, NavController, ToastController, LoadingController, Refresher, NavParams } from 'ionic-angular';
//import { Socket } from 'ng-socket-io';

import { AppData } from '../../providers/app-data';

import { LichHocDetailPage } from '../lichhoc-detail/lichhoc-detail'

import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';
import { ImportDetailPage } from '../import-detail/import-detail';

type AOA = any[][];

@Component({
    selector: 'page-lopmonhoc-detail',
    templateUrl: 'lopmonhoc-detail.html'
})
export class LopMonHocDetailPage {
    DSSV: any;

    dataInfo: any;
    MaLMH: any;
    title: any;

    //sinhvienList: any;
    //lichhocList: any;

    tabID: string;
    tabs = {
        // overview: 'Overview',
        lichhoc: 'Lịch học',
        sinhvien: 'Sinh viên',
        thongke: 'Thống kê'
    };
    activated = {
        // overview: 0,
        lichhoc: 0,
        sinhvien: 0,
        thongke: 0
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

    data: any[][] //= [[1,2,3],[4,5,6]];

    constructor(
        public alertCtrl: AlertController,
        public navParams: NavParams,
        public app: App,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public appData: AppData,
        public file: File
    ) {
        this.title = this.navParams.data.title;
        this.app.setTitle(this.title);

        this.dataInfo = this.navParams.data.dataInfo;
        this.dataInfo['title'] = this.title;
        this.MaLMH = this.navParams.data.MaLMH;

        this.loadSinhVienLMH();
        this.loadLichHoc();
        this.loadStat();

        //this.myUsername = this.appData.getUsername();
        this.changeTab('lichhoc');
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

    parseInt(n) {
        return parseInt(n)
    }

    loadLichHoc() {
        this.appData.loadLichHoc(this.MaLMH).subscribe((dataList: any) => {
            this.dataInfo['lichhoc'] = dataList;
        });
    }

    loadStat() {
        this.appData.loadStat(this.MaLMH).subscribe((dataList: any) => {
            this.dataInfo['stat'] = dataList;
            console.log(this.dataInfo['stat'])
        });
    }

    loadSinhVienLMH() {
        this.appData.loadSinhVienLMH(this.MaLMH).subscribe((dataList: any) => {
            if (dataList.length) {
                dataList.sort(function(a, b){
                    // console.log(a.HoTen)
                    if (a.HoTen && b.HoTen) {
                        let tenA = a.HoTen.split(/[, ]+/),
                            tenB = b.HoTen.split(/[, ]+/);
                        
                        while (tenA.length && tenB.length) {
                            let textA = tenA.pop().toUpperCase(),
                                textB = tenB.pop().toUpperCase();
                            if (textA < textB) {
                                return -1
                            } else if (textA > textB) {
                                return 1
                            }
                        }

                        if (tenA.length) return 1;
                        if (tenB.length) return -1;

                        console.log(tenA);

                    }
                    return 0;
                });
            }
            this.dataInfo['sinhvien'] = dataList

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


    AddDSDD() {
        document.getElementById('input_file').click();
    }


    read(bstr: string) {
        /* read workbook */
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        console.log(this.data);


        let modal = this.modalCtrl.create(ImportDetailPage, { data: this.data });
        modal.present();

        modal.onWillDismiss((data?: any) => {
            // console.log(data);
        });

        modal.onDidDismiss((data?: any) => {
            console.log('modal dismissed');
            console.log(data);
            if (data && data != undefined) {
                this.import()
            }
        });
    }

    /* File Input element for browser */
    onFileChange(evt: any) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            this.read(bstr);
        };
        reader.readAsBinaryString(target.files[0]);
    }

    import() {
        console.log(this.data);
        
        this.DSSV = [];
        for (let i = 8; i < this.data.length - 15; i++) {
            this.DSSV.push({
                MaSV: this.data[i][1],
                HoTen: this.data[i][2],
                NgaySinh: this.data[i][3],
                Lop: this.data[i][4]
            })
        }

        if (this.DSSV) {
            console.log({ MaLMH: this.dataInfo['MaLMH'], DSSV: this.DSSV });

            this.appData.submitDSSV({ MaLMH: this.dataInfo['MaLMH'], DSSV: this.DSSV }).subscribe((data: any) => {
                console.log('Done!!');
                console.log(data);

                this.appData.loadSinhVienLMH(this.MaLMH).subscribe((dataList: any) => {
                    this.dataInfo['sinhvien'] = dataList;
        
                    // simulate a network request that would take longer
                    // than just pulling from out local json file
                    setTimeout(() => {
        
                        const toast = this.toastCtrl.create({
                            message: 'Students list has been updated.',
                            duration: 3000
                        });
                        toast.present();
                    }, 1000);
                });
            });
        }
    }

    updateDSSV() {

    }

}
