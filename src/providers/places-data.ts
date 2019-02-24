import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

//import { UserData } from './user-data';

//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/observable/of';
import { UserData } from './user-data';
//import { UserData } from './user-data';


@Injectable()
export class PlacesData {
    data: any;
    user_token: any;

    constructor(
        public http: Http,
        public userData: UserData
    ) {

    }

    getPlaces(query: string) {
        return this.http.get('google_maps_api/place/textsearch/json?query='+query+'&key=AIzaSyAq5wBPNitgKYwdfLWpXShccN2VfDXmpv0').map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

}
