import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

//import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
//import { UserData } from './user-data';


@Injectable()
export class TripsData {
    data: any;
    user_token: any;

    constructor(
        public http: Http,
        //public userData: UserData
    ) {

    }

    load(): any {
        if (this.data) {
            return Observable.of(this.data);
        } else {
            // Get data here ~~~~~~~~~~~~~~~~~~~~~
            return this.http.get('assets/data/data.json').map((res:any) => res.json());
        }
    }


    loadPhotos(trip_id: string) {
        // Get data here ~~~~~~~~~~~~~~~~~~~~~
        return this.http.get('http://localhost:3003/trips/view/' + trip_id +'/photos').map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    loadTrip(id: string) {
        // Get data here ~~~~~~~~~~~~~~~~~~~~~
        return this.http.get('http://localhost:3003/trips/view/' + id).map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    loadTripsMy() {
        return this.http.get('http://localhost:3003/trips/').map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    loadTrips() {
        return this.http.get('http://localhost:3003/trips/').map((res: any) => {
            let data = res.json();
            console.log(data);

            return data
        })
    }

    getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
        return this.load().map((data: any) => {
            let day = data.toursList_Schedule[dayIndex];
            day.shownTours = 0;

            queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
            let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

            console.log(queryWords);
            console.log(excludeTracks);
            console.log(segment);
            /*day.groups.forEach((group: any) => {
              group.hide = true;
      
              group.tours.forEach((tour: any) => {
                // check if this tour should show or not
                this.filterTourSchedule(tour, queryWords, excludeTracks, segment);
      
                if (!tour.hide) {
                  // if this tour is not hidden then this group should show
                  group.hide = false;
                  day.shownTours++;
                }
              });
      
            });*/

            return day;
        });
    }

    loadAlbums() {
        return this.load().map((data: any) => {
            console.log(data);
            return data.albumsList.sort((a: any, b: any) => {
                let aName = a.title.split(' ').pop();
                let bName = b.title.split(' ').pop();
                return aName.localeCompare(bName);
            });
        });
    }


}
