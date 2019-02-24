import { Injectable } from '@angular/core';

import { Http, RequestOptions, Headers } from '@angular/http';

import { UserData } from './user-data';

//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class ToursData {
    data = {
        type: ["Interaction with local", "Nature adventure", "Foodies delight", "Traditional culture", "Relaxation"],
        object: {
            "group": "Group tour",
            "small": "Small group",
            "private": "Private tour"
        },
        suitable: ["Travel with friends", "Honeymoon couple", "Family with children", "Active traveler", "Solo traveler"],
        packages: {
            "2star": "Economi9jjjij\'?y (2*)",
            "3star": "Superior (3*)",
            "4star": "First Class (4*)",
            "5star": "Luxury (5*)"
        }
    };

    user_token: string;
    user_info: any;

    price_unit: string;

    constructor(
        public http: Http,
        public userData: UserData
    ) {
        this.price_unit = this.userData.getPriceUnit();

        this.userData.getToken().then((data) => {
            this.user_token = data;
        });
        this.userData.getUserInfo().then((data) => {
            this.user_info = data;
        })
    }


    getTourTheme() {
        return this.data.type;
    }

    getTourObject() {
        return this.data.object;
    }

    getTourSuitable() {
        return this.data.suitable;
    }

    getTourPackages() {
        return this.data.packages;
    }


    create(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.user_token);
        let options = new RequestOptions({ headers: headers });
        //console.log(this.user_token);

        params.user_info = this.user_info;
        return this.http.post('http://localhost:3003/user/tours/', params, options).map(res => res.json());
    }

    edit(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.user_token);
        let options = new RequestOptions({ headers: headers });
        //console.log(this.user_token);

        params.user_info = this.user_info;
        return this.http.put('http://localhost:3003/user/tours/', params, options).map(res => res.json());
    }

    refresh(tour: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.user_token);
        let options = new RequestOptions({ headers: headers });

        //return this.load().map((data: any) => {
        return this.http.post('http://localhost:3003/user/tours/refresh', { tour: tour }, options).map((res: any) => {
            let response = res.json();
            console.log(response);
        })
    }


    loadType() {
        return this.http.get('http://localhost:3003/tours/type/').map((res: any) => {
            let d = res.json();
            var types = [];
            for (let k in d) {
                types.push(d[k])
            }
            return types
        })
    }

    loadObject() {
        return this.http.get('http://localhost:3003/tours/object/').map((res: any) => {
            let d = res.json();
            var objects = [];
            for (let k in d) {
                objects.push(d[k])
            }
            return objects
        })
    }

    loadTour(id: string) {
        // Get data here ~~~~~~~~~~~~~~~~~~~~~
        return this.http.get('http://localhost:3003/tours/view/' + id).map((res: any) => {
            let tour = res.json();

            tour.objectStr = tour.object.join(', ');

            if (tour.full_tour == true) {
                if (tour.departure.type == 'daily') {
                    tour.departure.txt = 'Daily from ' + tour.departure.from
                } else if (tour.departure.type == 'repeat') {
                    tour.departure.txt = 'Every ' + tour.departure.days.join(', ') + ' from ' + tour.departure.from
                } else if (tour.departure.type == 'days') {
                    tour.departure.txt = 'On ' + tour.departure.days.join(', ') + ' from ' + tour.departure.from
                }
            }

            var minPrice = -1;
            //var dvi = '';
            tour.dvi = (this.price_unit) ? this.price_unit : tour.price_unit;

            tour.packageAr = [];
            for (let pKey in tour.package) {
                tour.packageAr.push(tour.package[pKey]);

                for (var _j = 0; _j < tour.package[pKey].price.length; _j++) {
                    // check if dollar or triệu
                    if (tour.package[pKey].price[_j].length > 0) {
                        //dvi = tour.package[pKey].price[_j].indexOf(' triệu') > -1 ? ' triệu' : '$';
                        //var pNum = parseInt(tour.package[pKey].price[_j].replace(/[^\d.]/g, ''));
                        var pNum = tour.package[pKey].price[_j];
                        if (minPrice == -1 || minPrice > pNum) minPrice = pNum;
                    }
                }
            }

            tour.minPrice = tour.dvi == '$' ? '$' + minPrice : minPrice + ' ' + tour.dvi;

            //console.log(tour);

            return tour
        })
    }

    processData(data: any) {
        // just some good 'ol JS fun with objects and arrays
        // build up the data by linking users to tours
        this.data = data.json();

        /*this.data.toursList.forEach((tour: any) => {
          if (tour.type) {
            tour.type.forEach((type: any) => {
              if (this.data.tourType.indexOf(type) < 0) {
                this.data.tourType.push(type);
              }
            });
          }
        });*/

        // loop through each day in the toursList
        /*this.data.toursList_Schedule.forEach((day: any) => {
          // loop through each timeline group in the day
          day.groups.forEach((group: any) => {
            // loop through each tour in the timeline group
            group.tours.forEach((tour: any) => {
              tour.users = [];
              if (tour.userNames) {
                tour.userNames.forEach((userName: any) => {
                  let user = this.data.users.find((s: any) => s.name === userName);
                  if (user) {
                    tour.users.push(user);
                    user.tours = user.tours || [];
                    user.tours.push(tour);
                  }
                });
              }
    
              if (tour.tracks) {
                tour.tracks.forEach((track: any) => {
                  if (this.data.tracks.indexOf(track) < 0) {
                    this.data.tracks.push(track);
                  }
                });
              }
            });
          });
        });*/

        return this.data;
    }

    loadTours(queryText = '', segment = 'all') {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', this.user_token);
        let options = new RequestOptions({ headers: headers });
        console.log(this.user_token + '~~~~');

        console.log('loadTours called~');
        //return this.load().map((data: any) => {
        return this.http.get('http://localhost:3003/tours/', options).map((res: any) => {
            queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
            let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
            console.log(queryWords);

            let tours_list = [];

            let toursList = res.json();
            //console.log(toursList);

            toursList.forEach((tour: any) => {
                tour.objectStr = tour.object.join(', ');
                tour.destination = tour.destination.join(' - ');
                tour.suitable = tour.suitable.join(', ');

                if (tour.full_tour) {
                    if (tour.departure.type == 'daily') {
                        tour.departure.txt = 'Daily from ' + tour.departure.from
                    } else if (tour.departure.type == 'repeat') {
                        tour.departure.txt = 'Every ' + tour.departure.days.join(', ') + ' from ' + tour.departure.from
                    } else if (tour.departure.type == 'days') {
                        tour.departure.txt = 'On ' + tour.departure.days.join(', ') + ' from ' + tour.departure.from
                    }
                }

                if (tour.duration.indexOf('days') > -1) {
                    tour.daysNum = tour.duration.split('days')[0] + ' days';
                } else {
                    tour.daysNum = tour.duration.split('ngày')[0] + ' ngày';
                }
                // get tour min price
                var minPrice = -1;
                tour.dvi = (this.price_unit) ? this.price_unit : tour.price_unit;
                tour.packageAr = [];
                for (let pKey in tour.package) {
                    tour.packageAr.push(tour.package[pKey]);

                    //console.log(tour.package[pKey].price);

                    for (var _j = 0; _j < tour.package[pKey].price.length; _j++) {
                        //console.log(_j);
                        // check if dollar or triệu
                        //if (tour.package[pKey].price[_j].length > 0) {
                        /*dvi = tour.package[pKey].price[_j].indexOf(' triệu') > -1 ? ' triệu' : '$';
                        var pNum = parseInt(tour.package[pKey].price[_j].replace(/[^\d.]/g, ''));
                        if (minPrice == -1 || minPrice > pNum) minPrice = pNum;*/
                        var pNum = tour.package[pKey].price[_j];
                        //console.log(pNum);
                        if (minPrice == -1 || minPrice > pNum) minPrice = pNum;
                        //}
                    }
                }
                tour.minPrice = (tour.dvi == '$' ? '$' + minPrice : minPrice + ' ' + tour.dvi);

                tour.hide = true;
                // check if this tour should show or not
                //this.filterTour(tour, queryWords, segment);
                this.filterFav(tour, segment);
                if (!tour.hide) {
                    tours_list.push(tour);
                }
            });

            return tours_list;
        });
    }

    inquire(params: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //headers.append('Accept', 'application/json');
        headers.append('Authorization', this.user_token);

        let options = new RequestOptions({ headers: headers });

        params.user_info = this.user_info;

        return this.http.post('http://localhost:3003/tours/inquire/', params, options).map(res => res.json());
    }

    countWaiting(params: any) {
        return this.http.post('http://localhost:3003/tours/my_bills_count/', params).map(res => res.json());
    }

    filterFav(tour: any, segment: string) {
        let matchesSegment = false;
        if (segment === 'favorites') {
            if (this.userData.hasFavorite(tour.title)) {
                matchesSegment = true;
            }
        } else {
            matchesSegment = true;
        }

        // all tests must be true if it should not be hidden
        tour.hide = !(matchesSegment);
    }

    filterTour(tour: any, queryWords: string[], segment: string) {
        console.log(queryWords);
        let matchesQueryText = false;
        /*if (queryWords.length) {
          // of any query word is in the tour title than it passes the query test
          queryWords.forEach((queryWord: string) => {
            if (tour.title.toLowerCase().indexOf(queryWord) > -1) {
              matchesQueryText = true;
            }
          });
        } else {
          // if there are no query words then this tour passes the query test
          matchesQueryText = true;
        }*/
        matchesQueryText = true;

        // if the segement is 'favorites', but tour is not a user favorite
        // then this tour does not pass the segment test
        let matchesSegment = false;
        if (segment === 'favorites') {
            if (this.userData.hasFavorite(tour.title)) {
                matchesSegment = true;
            }
        } else {
            matchesSegment = true;
        }

        // all tests must be true if it should not be hidden
        tour.hide = !(matchesQueryText && matchesSegment);
    }

}
