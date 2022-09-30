import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  timerSubscription: Subscription; 
  language: string = this.translateService.currentLang; // 2


  constructor(
    public router: Router,
    private translateService: TranslateService,) {
    // timer(0, 10000) call the function immediately and every 10 seconds 
    this.timerSubscription = timer(0, 10000).pipe( 
      map(() => { 
        //if(this.showedOne==){

       // }
        this.getUser(); // load data contains the http request 
      }) 
    ).subscribe(); 
  }


  getUser(){
    console.log(JSON.parse(localStorage.getItem('user_owner')));
    return JSON.parse(localStorage.getItem('user_owner'));
  }

}
