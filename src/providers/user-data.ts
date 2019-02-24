import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class UserData {
    _favorites: string[] = [];
    HAS_LOGGED_IN = 'hasLoggedIn';
    HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
    data: any;

    user_token: any;
    price_unit = '$';

    constructor(
        public events: Events,
        public storage: Storage,
        public http: Http
    ) {
        this.getToken().then((data) => {
            this.user_token = data;
        });
    }

    getPriceUnit() {
        return this.price_unit;
    }

    load(): any {
        if (this.data) {
            return Observable.of(this.data);
        } else {
            // Get data here ~~~~~~~~~~~~~~~~~~~~~
            return this.http.get('assets/data/data.json');
        }
    }


    loadUsers() {
        return this.load().map((data: any) => {
            return data.users.sort((a: any, b: any) => {
                let aName = a.name.split(' ').pop();
                let bName = b.name.split(' ').pop();
                return aName.localeCompare(bName);
            });
        });
    }

    loadUser(id: string) {
        return { id: id }
    }

    hasFavorite(sessionName: string): boolean {
        return (this._favorites.indexOf(sessionName) > -1);
    };

    addFavorite(sessionName: string): void {
        this._favorites.push(sessionName);
    };

    removeFavorite(sessionName: string): void {
        let index = this._favorites.indexOf(sessionName);
        if (index > -1) {
            this._favorites.splice(index, 1);
        }
    };

    login(params: any) {
        /*let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('X-Requested-With', 'XMLHttpRequest');*/

        //let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'});
        //let options = new RequestOptions({ headers: headers });

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        /*return this.http.post('http://localhost:3003/login', params).map((res: any) => {
          let response = res.json();
          if (response.status == 'success') {
            this.storage.set(this.HAS_LOGGED_IN, true);
            
            this.setUsername(params.username);
            this.storage.set('token', response.token);
    
            this.events.publish('user:login');
          }
          return response
        });*/

        this.http.post('http://localhost:3003/login', params).map(res => res.json()).subscribe(response => {
            console.log(response);
            if (response.status == 'success') {
                this.storage.set(this.HAS_LOGGED_IN, true);

                this.setUsername(params.username);
                this.storage.set('token', response.token);
                this.storage.set('user_info', response.user_info);

                this.events.publish('user:login');
            }
        }, err => {
            console.log("ERROR!: ", err);
        })
    };

    getMessagesList() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //headers.append('Accept', 'application/json');
        headers.append('Authorization', this.user_token);

        let options = new RequestOptions({ headers: headers });

        return this.http.get('http://localhost:3003/user/messages_list', options).map((res: any) => {
            let data = res.json();
            //console.log(data);

            return data
        })
    }

    signup(params: any): void {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(params.username);
        this.events.publish('user:signup');
    };

    logout(): void {
        this.storage.remove(this.HAS_LOGGED_IN);
        this.storage.remove('username');
        this.storage.remove('token');
        this.storage.remove('user_info');
        this.events.publish('user:logout');
    };

    setUsername(username: string): void {
        this.storage.set('username', username);
    };

    getUsername(): Promise<string> {
        return this.storage.get('username').then((value) => {
            return value;
        });
    };

    getToken() {
        return this.storage.get('token');
    }

    getUserInfo() {
        //console.log(this.storage.get('user_info'));
        return this.storage.get('user_info');
    };

    getUserInfoPromise(): Promise<object> {
        return this.storage.get('user_info').then((value) => {
            return value;
        });
    };

    hasLoggedIn(): Promise<boolean> {
        return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
            return value === true;
        });
    };

    checkHasSeenTutorial(): Promise<string> {
        return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
            return value;
        });
    };
}
