import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { MonHocPage } from '../pages/monhoc/monhoc';
import { LopMonHocPage } from '../pages/lopmonhoc/lopmonhoc';
import { LoginPage } from '../pages/login/login';
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
        { title: 'Home', component: HomePage },
        { title: 'MonHoc', component: MonHocPage },
    ];
    loggedInPages: PageInterface[] = [
        { title: 'LopMonHoc', component: LopMonHocPage },
    ];
    loggedOutPages: PageInterface[] = [
        { title: 'Login', component: LoginPage },
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

        this.appData.hasLoggedIn().then((hasLoggedIn) => {
            this.isLoggedIn = hasLoggedIn;
            console.log(hasLoggedIn+'~~~~~~');
            this.enableMenu(hasLoggedIn === true);

            this.appData.getUserInfoPromise().then((data) => {
                console.log(data);
                this.user_info = data;
            });
        });
        this.enableMenu(true);

        this.listenToLoginEvents();
    
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.enableMenu(true);

            this.appData.hasLoggedIn().then((hasLoggedIn) => {
                this.isLoggedIn = hasLoggedIn;
                console.log(hasLoggedIn+'~~~~~~');
                this.enableMenu(hasLoggedIn === true);
    
                this.appData.getUserInfoPromise().then((data) => {
                    console.log(data);
                    this.user_info = data;
                });
            });
        });

        this.events.subscribe('user:signup', () => {
            this.enableMenu(true);
        });

        this.events.subscribe('user:logout', () => {
            this.enableMenu(false);
        });
    }


    enableMenu(loggedIn: boolean) {
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
    }
}
