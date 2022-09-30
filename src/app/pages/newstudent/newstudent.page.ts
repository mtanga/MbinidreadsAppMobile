import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-newstudent',
  templateUrl: './newstudent.page.html',
  styleUrls: ['./newstudent.page.scss'],
})
export class NewstudentPage implements OnInit {
  settings: any = {};
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  password : any;
  username : any;
  firstName : any;
  lastName : any;
  langue : any;
  language: string = this.translateService.currentLang; // 2
  age : any;
  sub: any;
  class_id: any;
  class_name: any;

  constructor(
    private translateService: TranslateService,
    private toast : ToastService,
    private routes : RoutesService,
    private route : ActivatedRoute,
    private api : ApiService
  ) { }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.class_id = params['id'];
      this.class_name = params['class'];
     // this.retrieveClass(this.id);
    });
    this.api.getData("student_settings").subscribe( async (da:any)=>{
      console.log(da);
      this.settings = da.data;
    })
  }

  getUser(){
    console.log("utilisateur", JSON.parse(localStorage.getItem('user_owner')));
    //console.log("role", JSON.parse(localStorage.getItem('user_owner'))?.user?.roles[0].title);
    return JSON.parse(localStorage.getItem('user_owner'));
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

  async add(){
    if(this.firstName=="" || this.firstName==null || this.firstName==undefined){
      this.toast.presentToast(await this.translateService.get('empty_firstName').toPromise());
    }
    else if(this.lastName=="" || this.lastName==null || this.lastName==undefined){
      this.toast.presentToast(await this.translateService.get('empty_lastName').toPromise());
    }
    else if(this.username=="" || this.username==null || this.username==undefined){
      this.toast.presentToast(await this.translateService.get('empty_username').toPromise());
    }
    else if(this.langue=="" || this.langue==null || this.langue==undefined){
      this.toast.presentToast(await this.translateService.get('empty_language').toPromise());
    }
    else if(this.age=="" || this.age==null || this.age==undefined){
      this.toast.presentToast(await this.translateService.get('empty_age').toPromise());
    }
    else if(this.password=="" || this.password==null || this.password==undefined){
      this.toast.presentToast(await this.translateService.get('empty_password').toPromise());
    }
    else{
      let data = {
        fisrt_name : this.firstName,
        last_name : this.lastName,
        username : this.username,
        langue : this.langue,
        age : this.age,
        password : this.password,
        class_id : this.class_id
      }
      this.api.getDatas("add_student", data).subscribe( async (da:any)=>{
        if(da.success == true){
          let data = {
            id: this.class_id,
            class : this.class_name,
            }
          this.routes.urlWithParams("/classeroom", data)
        }
        
      })
    }
  }

  async addStudent(){
      if(this.firstName=="" || this.firstName==null || this.firstName==undefined){
        this.toast.presentToast(await this.translateService.get('empty_firstName').toPromise());
      }
      else if(this.lastName=="" || this.lastName==null || this.lastName==undefined){
        this.toast.presentToast(await this.translateService.get('empty_lastName').toPromise());
      }
      else if(this.username=="" || this.username==null || this.username==undefined){
        this.toast.presentToast(await this.translateService.get('empty_username').toPromise());
      }
      else if(this.langue=="" || this.langue==null || this.langue==undefined){
        this.toast.presentToast(await this.translateService.get('empty_language').toPromise());
      }
      else if(this.age=="" || this.age==null || this.age==undefined){
        this.toast.presentToast(await this.translateService.get('empty_age').toPromise());
      }
      else if(this.password=="" || this.password==null || this.password==undefined){
        this.toast.presentToast(await this.translateService.get('empty_password').toPromise());
      }
      else{
        let data = {
          fisrt_name : this.firstName,
          last_name : this.lastName,
          username : this.username,
          langue : this.langue,
          age : this.age,
          password : this.password,
          user : this.class_id
        }
        this.api.getDatas("add_student_parent", data).subscribe( async (da:any)=>{
          if(da.success == true){
            this.routes.urlSample("/tabs/tab1");
          }
          
        })
      }
    }
  

}
