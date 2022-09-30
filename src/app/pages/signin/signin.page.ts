import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { TranslateService } from '@ngx-translate/core'; // 1
import { ToastService } from 'src/app/shared/services/toast.service';
import { ApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  password : any;
  language: string = this.translateService.currentLang; // 2
  email : any;


  constructor(
    private routes : RoutesService,
    private alertController : AlertController,
    private translateService: TranslateService,
    private toast : ToastService,
    private api : ApiService
  ) { }

  ngOnInit() {
  }


  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

register(){
  this.routes.urlSample("register");
}

languageChange() {  // add this
  console.log(this.language);
  this.translateService.use(this.language);  // add this
}  // add this

async reset(){
  const actionSheet = await this.alertController.create({
    //title: 'Hello',
    header: await this.translateService.get('send_reset_link').toPromise(),
    message: await this.translateService.get('fill_your_email').toPromise(),
    cssClass: 'my-custom-class',
    inputs: [
      {
        name: 'email',
        placeholder: 'e-mail',
        type: 'email'
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
        text: await this.translateService.get('send').toPromise(),
        handler: (data) => {
            this.resetLink(data.email);
        }
      }
    
    ]
  });
  await actionSheet.present();
}


  async login(){
      if(this.email=="" || this.email==null || this.email==undefined){
          this.toast.presentToast(await this.translateService.get('empty_email').toPromise());
      }
      else if(this.isValid(this.email) == false){
        this.toast.presentToast(await this.translateService.get('incorrect_email').toPromise());
      }
      else if (this.password=="" || this.password==null || this.password==undefined){
        this.toast.presentToast(await this.translateService.get('empty_pass').toPromise());
      }

      else{
        let data = {
          email : this.email,
          password : this.password
        }
        this.api.loginOwner(data).subscribe((data:any)=>{
          //console.log("message", data)
          if(data.success == true){
              //console.log(data.data);
              this.redirectafterLogin(data);
          }
          else{
            //console.log("message", data)
            this.notLogin();
          }
        })
      }
  }

  async resetLink(email){
    if(email=="" || email==null || email==undefined){
      this.toast.presentToast(await this.translateService.get('empty_email').toPromise());
    }
    else{
      if(this.isValid(email) == false){
        this.toast.presentToast(await this.translateService.get('incorrect_email').toPromise());
      }
      else{
        let data = {
          email : email
        }
        this.api.forgotOwner(data).subscribe((datas:any)=>{
          this.resetFinale(datas);

        })
      }

    }

  }

  async resetFinale(datas){
    console.log(datas)
    if(datas.message == "Success"){
      this.toast.presentToast(await this.translateService.get('email_sent').toPromise());
    }
    else if (datas.message == "No existed"){
      this.toast.presentToast(await this.translateService.get('email_no_existed').toPromise());
    }
    else if (datas.message == "Error"){
      this.toast.presentToast(await this.translateService.get('email_not_sent').toPromise());
    }
    else{

    }
  }

  isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


  async redirectafterLogin(data){
    console.log(data.data);
    if(data.data.email_verified_at==null){
      this.toast.presentToast(await this.translateService.get('not_verified_email').toPromise()+data.data.email);
    }
    else{
      this.toast.presentToast(await this.translateService.get('nice_to_see_you').toPromise()+data.data.fisrt_name);
      let user = {
        user_login: true,
        user : data.data,
        login : null
      };
      localStorage.setItem('user_owner', JSON.stringify(user));
      this.routes.urlSample("/tabs/tab1");
    }
  }

  async notLogin(){
    this.toast.presentToast(await this.translateService.get('error_login').toPromise());
  }



}
