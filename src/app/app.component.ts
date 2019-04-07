import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { MonHocPage } from '../pages/monhoc/monhoc';
import { LopMonHocPage } from '../pages/lopmonhoc/lopmonhoc';
import { LoginPage } from '../pages/login/login';
import { LichPage } from '../pages/lich/lich';
//import { LopMonHocDetailPage } from '../pages/lopmonhoc-detail/lopmonhoc-detail';
import { AppData } from '../providers/app-data';

export interface PageInterface {
    title: string;
    name?: string;
    component: any;
    icon?: string;
    logsOut?: boolean;
    index?: number;
    tabName?: string;
    tabComponent?: any;
}


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;

    user_info: any = {};
    isLoggedIn: boolean = false;

    //pages: Array<{ title: string, component: any }>;
    pages: PageInterface[] = [
        { title: 'Trang chủ', component: HomePage },
        { title: 'Môn học', component: MonHocPage },
    ];
    loggedInPages: PageInterface[] = [
        { title: 'Lớp môn học', component: LopMonHocPage },
        { title: 'Lịch', component: LichPage },
        //{ title: 'Logout', component: HomePage, logsOut: true }
        { title: 'Đăng xuất', component: MonHocPage, logsOut: true }
    ];
    loggedOutPages: PageInterface[] = [
        { title: 'Đăng nhập', component: LoginPage },
    ];

    constructor(
        public events: Events,
        public menu: MenuController,
        public platform: Platform,

        public appData: AppData,

        public storage: Storage,
        public splashScreen: SplashScreen,

        public statusBar: StatusBar
    ) {
        this.initializeApp();

        /*this.appData.hasLoggedIn().then((hasLoggedIn) => {
            this.isLoggedIn = hasLoggedIn;
            console.log(hasLoggedIn+'~~~~~~');
            this.enableMenu(hasLoggedIn === true);

            this.appData.getUserInfoPromise().then((data) => {
                console.log(data);
                this.user_info = data;
            });
        });
        this.enableMenu(true);*/
        this.appData.getUserInfoPromise().then((data) => {
            console.log(data);
            if (data != null) {
                this.isLoggedIn = true;
                this.enableMenu(true);

                console.log('this.isLoggedIn = ' + this.isLoggedIn);
                this.user_info = data;
            }
        });

        this.listenToLoginEvents();

    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', (user_info) => {
            //console.log(user_info);
            this.isLoggedIn = true;
            this.enableMenu(true);

            //console.log('this.isLoggedIn = ' + this.isLoggedIn);
            this.user_info = user_info;
        });

        this.events.subscribe('user:signup', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:logout', () => {
            this.enableMenu(false);
        });
    }


    enableMenu(loggedIn: boolean) {
        console.log('enableMenu ~ ' + loggedIn);
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    }


    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        
        if (page.logsOut === true) {
            // Give the menu time to close before changing to logged out
            //this.appData.logout();
            this.storage.remove('hasLoggedIn');
            //this.storage.remove('username');
            //this.storage.remove('token');
            this.storage.remove('user_info');
            this.isLoggedIn = false;
            this.events.publish('user:logout');

            //this.nav.popToRoot();
        } else {
            
        }
    }
}
