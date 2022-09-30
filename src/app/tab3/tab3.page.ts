import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/services/api.service';
import { RoutesService } from '../shared/services/routes.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  timerSubscription: Subscription; 
  language: string = this.translateService.currentLang; // 2
  classes: any;
  infos: any = {};

  
  constructor(
    private translateService: TranslateService,
    private api : ApiService,
    private routes : RoutesService,
    private alertController : AlertController,
  ) {
            // timer(0, 10000) call the function immediately and every 10 seconds 
            this.timerSubscription = timer(0, 10000).pipe( 
              map(() => { 
                //if(this.showedOne==){
        
               // }
                this.getUser(); // load data contains the http request 
              }) 
            ).subscribe(); 
  }


  ngOnInit() {
 
        this.getInfosUser(JSON.parse(localStorage.getItem('user_owner')).user.id);
    
  }

  getInfosUser(id){
    let data ={
      id : id
    }
    this.api.getDatas("data_user", data).subscribe( async (da:any)=>{
      console.log("infos", da)
       this.infos = da.data;
    })//
  }

  getUser(){
    console.log(JSON.parse(localStorage.getItem('user_owner')));
    console.log("role", JSON.parse(localStorage.getItem('user_owner'))?.user?.roles[0].title);
    return JSON.parse(localStorage.getItem('user_owner'));
  }

  async editPassword(){
    const actionSheet = await this.alertController.create({
      header: await this.translateService.get('edit_password').toPromise(),
      cssClass: 'my-custom-class',
      inputs: [
        {
          name: 'old',
          placeholder: await this.translateService.get('old_password').toPromise(),
          type: 'text'
        },
        {
          name: 'new',
          placeholder: await this.translateService.get('new_password').toPromise(),
          type: 'text'
        }
      ],
      buttons: [
        {
          text: await this.translateService.get('cancel').toPromise(),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: await this.translateService.get('edit_password').toPromise(),
          handler: (data) => {
            if(data.classeroom){
              let datas ={
                old : data.old,
                new : data.new,
                user : JSON.parse(localStorage.getItem('user_owner')).user.id
              }
              this.api.getDatas("add_classe", datas).subscribe( async (da:any)=>{
                if(da.success == true){
                  //..this.show("class_added");
                 // this.getclasses(this.getUser()?.user?.id);
                }
                
              })
            }

          }
        }
      
      ]
    });
    await actionSheet.present();
  }

  logout(){
    localStorage.removeItem('user_owner');
    this.routes.urlSample("/signin")
  }

}
