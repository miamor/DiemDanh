import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Http } from '@angular/http';

//import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
//import { c } from '@angular/core/src/render3';


@Injectable()
export class AppData {
    
    HAS_LOGGED_IN = 'hasLoggedIn';
    user_info: any;
    userID: any;

    constructor(
        public events: Events,
        public storage: Storage,
        public http: Http
    ) {
        this.getUserInfo().then((data) => {
            if (data) {
                this.user_info = data;
                this.userID = data['MaGV'];
            }
        });
    }

    listMonHoc(): any {
        return this.http.get('http://192.168.43.239/DiemDanh/api/monhoc/list.php').map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    listLopMonHocByUserID(userID: string): any {
        //console.log(userID);
        return this.http.post('http://192.168.43.239/DiemDanh/api/lopmonhoc/list_by_gv.php', {gvID: userID}).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    listLopMonHocByUserID_week(userID: string): any {
        //console.log(userID);
        return this.http.post('http://192.168.43.239/DiemDanh/api/lopmonhoc/list_by_gv_in_week.php', {gvID: userID}).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    loadLopMonHoc(MaLMH: string): any {
        return this.http.post('http://192.168.43.239/DiemDanh/api/lopmonhoc/readOne.php', {MaLMH: MaLMH}).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    loadLichHoc(MaLMH: string): any {
        return this.http.post('http://192.168.43.239/DiemDanh/api/lichhoc/get_by_malmh.php', {MaLMH: MaLMH}).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    loadStat(MaLMH: string): any {
        return this.http.post('http://192.168.43.239/DiemDanh/api/lopmonhoc/stat.php', {MaLMH: MaLMH}).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    loadSinhVien(MaLop: string): any {
        return this.http.post('http://192.168.43.239/DiemDanh/api/sinhvien/get_by_malop.php', {MaLop: MaLop}).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    loadSinhVienLMH(MaLopMH: string): any {
        return this.http.post('http://192.168.43.239/DiemDanh/api/sinhvien/get_by_malmh.php', {MaLopMH: MaLopMH}).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    getChiTietDiemDanh(MaLichHoc: string): any {
        return this.http.post('http://192.168.43.239/DiemDanh/api/diemdanh/get_by_malichhoc.php', {MaLichHoc: MaLichHoc}).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    submitDiemDanh(params: any): any {
        console.log(params);
        return this.http.post('http://192.168.43.239/DiemDanh/api/diemdanh/submit.php', params).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    submitDSSV(params: any): any {
        return this.http.post('http://192.168.43.239/DiemDanh/api/lopmonhoc/submitDSSV.php', params).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    login(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://192.168.43.239/DiemDanh/api/login.php', params).map((res: any) => {
            //console.log(res);
            let data = res.json();
            //console.log(data);

            return data
        })/*.subscribe(response => {
            console.log(response);
            if (response.status == 'success') {
                this.storage.set('hasLoggedIn', true);

                this.storage.set('user_info', response.user_info);

                this.events.publish('user:login');
            }
        }, err => {
            console.log("ERROR!: ", err);
        })*/
    }

    logout(): void {
        this.storage.remove('hasLoggedIn');
        this.storage.remove('username');
        //this.storage.remove('token');
        this.storage.remove('user_info');
        this.events.publish('user:logout');
    };

    hasLoggedIn(): Promise<boolean> {
        return this.storage.get('hasLoggedIn').then((value) => {
            console.log('hasLoggedIn = '+value)
            return value == true;
        });
    };


    getUserInfo(): Promise<string> {
        return this.storage.get('user_info');
    };

    getUserInfoPromise(): Promise<object> {
        return this.storage.get('user_info').then((value) => {
            //console.log(value);
            
            return value;
        });
    };

}
