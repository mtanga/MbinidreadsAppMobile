import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(
    public router: Router,
  ) { }



  urlSample(url){
    this.router.navigate([url]);
  }

  urlWithParams(url, params){
    console.log(params);
    //this.router.navigate([url]);
    this.router.navigate([url], { queryParams: params
    });
  }
}
