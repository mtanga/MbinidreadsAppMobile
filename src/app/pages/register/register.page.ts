import { Component, OnInit } from '@angular/core';

import { RoutesService } from 'src/app/shared/services/routes.service';
import { TranslateService } from '@ngx-translate/core'; // 1
import { ToastService } from 'src/app/shared/services/toast.service';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  password : any;
  email : any;
  firstName : any;
  lastName : any;
  role : any;
  roles : any;

  phone : any;
  language: string = this.translateService.currentLang; // 2

  constructor(
    private translateService: TranslateService,
    private toast : ToastService,
    private routes : RoutesService,
    private api : ApiService
  ) { }

  ngOnInit() {
    this.api.getData("roles").subscribe( async (da:any)=>{
      console.log(da);
      this.roles = da.data;
    })
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

languageChange() {  // add this
  console.log(this.language);
  this.translateService.use(this.language);  // add this
}  // add this


login(){
  this.routes.urlSample("signin");
}

async register(){
  if(this.firstName=="" || this.firstName==null || this.firstName==undefined){
    this.toast.presentToast(await this.translateService.get('empty_firstName').toPromise());
  }
  else if(this.lastName=="" || this.lastName==null || this.lastName==undefined){
    this.toast.presentToast(await this.translateService.get('empty_lastName').toPromise());
  }
  else if(this.phone=="" || this.phone==null || this.phone==undefined){
    this.toast.presentToast(await this.translateService.get('empty_phone').toPromise());
  }
  else if(this.email=="" || this.email==null || this.email==undefined){
    this.toast.presentToast(await this.translateService.get('empty_email').toPromise());
  }
  else if(this.isValid(this.email) == false){
    this.toast.presentToast(await this.translateService.get('incorrect_email').toPromise());
  }
  else if(this.role=="" || this.role==null || this.role==undefined){
    this.toast.presentToast(await this.translateService.get('empty_role').toPromise());
  }
  else if(this.password=="" || this.password==null || this.password==undefined){
    this.toast.presentToast(await this.translateService.get('empty_password').toPromise());
  }
  else{
    let data = {
      fisrt_name : this.firstName,
      last_name : this.lastName,
      phone : this.phone.internationalNumber,
      email : this.email,
      password : this.password,
      role : this.role
    }
    console.log(data)
    this.api.registerOwner(data).subscribe((data:any)=>{
      //console.log("message", data)
      if(data.message == "Success"){
          //console.log(data.data);
          this.redirectafterRegister(data);
      }
      else{
        //console.log("message", data)
        this.notRegister();
      }
    })
  }


}

  async redirectafterRegister(data){
    this.toast.presentToast(await this.translateService.get('success_register').toPromise());
    this.routes.urlSample("signin");
  }

async notRegister(){
  this.toast.presentToast(await this.translateService.get('erroe_register').toPromise());

}

isValid(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

}
