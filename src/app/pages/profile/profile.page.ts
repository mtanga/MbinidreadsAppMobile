import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';


  sub: any;
  student: any = {};
  language: string = this.translateService.currentLang; // 2
  settings: any = {};
  score : any = {};
  langue: any = {};
  age: any = {};
  classe: any = {};
  password : any;
  sonAge : any;
  setting: any;


  constructor(
    private translateService: TranslateService,
    private toast : ToastService,
    private routes : RoutesService,
    private route : ActivatedRoute,
    private api : ApiService,
    private alertController : AlertController,
  ) { 

  }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      let user  = params['id'];
      this.gettudent(user);

    });
  }

  gettudent(user){
    let data ={
      id : user
    }
    this.api.getDatas("get_student", data).subscribe( async (da:any)=>{
      console.log("profile", da.data[0]);
      this.settings = da.data[0];
      this.student = da.data[0].student;
      this.langue = da.data[0].student.langue;
      this.classe = da.data[0].student.classe;
      this.age = da.data[0].student.age;
      this.score = da.data[0].score[0];
      this.getSettings();
    })
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}


  getSettings() {
    this.api.getData("student_settings").subscribe( async (da:any)=>{
      console.log(da);
      this.setting = da.data;
    })
  }

  

  switchUser(){
    let userConnected = JSON.parse(localStorage.getItem('user_owner'));
    localStorage.removeItem('user_owner');
    localStorage.setItem('user_old_connected', JSON.stringify(userConnected));
    localStorage.setItem('studentStored', JSON.stringify(this.student));
    this.routes.urlSample("login");
  }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss('confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      //this.message = `Hello, ${ev.detail.data}!`;
    }
  }



  async edit(){
    if(this.student.first_name=="" || this.student.first_name==null || this.student.first_name==undefined){
      this.toast.presentToast(await this.translateService.get('empty_firstName').toPromise());
    }
    else if(this.student.last_name=="" || this.student.last_name==null || this.student.last_name==undefined){
      this.toast.presentToast(await this.translateService.get('empty_lastName').toPromise());
    }
    else if(this.student.username=="" || this.student.username==null || this.student.username==undefined){
      this.toast.presentToast(await this.translateService.get('empty_username').toPromise());
    }
    else if(this.student.password=="" || this.student.password==null || this.student.password==undefined){
      this.toast.presentToast(await this.translateService.get('empty_password').toPromise());
    }
    else{
      let data = {
        first_name : this.student.first_name,
        last_name : this.student.last_name,
        username : this.student.username,
        age : this.sonAge || this.age.id,
        password : this.student.password,
        id : this.student.id
      }
      this.api.getDatas("edit_student", data).subscribe( async (da:any)=>{
        if(da.success == true){
          this.gettudent(this.student.id);  
          this.modal.dismiss('confirm');
        }
        
      })
    }
  }




}
