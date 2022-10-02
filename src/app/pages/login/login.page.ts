import { Component, OnInit } from '@angular/core';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { TranslateService } from '@ngx-translate/core'; // 1
import { NetworkService } from 'src/app/shared/services/network.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { SoundService } from 'src/app/shared/services/sound.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  password : any;
  username : any;
  langue : any;

  student : any = {
    password : "",
    username : ""
  }

  language: string = this.translateService.currentLang; // 2
  readersOnline: any;
  readingBooks: any;
  id: any;
  user : any;
  studentStorage: any;



  constructor(
    private routes : RoutesService,
    private translateService: TranslateService,
    private network : NetworkService,
    private api : ApiService,
    private toast : ToastService,
    private play : SoundService
  ) { }

  ngOnInit() {
    //this.studentStorage = JSON.parse(localStorage.getItem('studentStored'));
    if(JSON.parse(localStorage.getItem('studentStored'))){
      this.student = {
        password : JSON.parse(localStorage.getItem('studentStored')).password,
        username : JSON.parse(localStorage.getItem('studentStored')).username
      }
    }

    //console.log(JSON.parse(localStorage.getItem('studentStored')));
    this.get_readingBooks();

  }

  get_readingBooks(){
    this.api.getData("reading_books").subscribe( async (da:any)=>{
      this.readingBooks = da.data;
    })
    this.readers_online();
    //return this.readingBooks;
  }

  readers_online(){
    this.api.getData("connected_users").subscribe( async (da:any)=>{
      this.readersOnline = da.data;
    })
    //return this.readersOnline;
  }


  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}

languageChange() {  // add this
  console.log(this.language);
  this.translateService.use(this.language);  // add this
}  // add this

parent(){
  this.routes.urlSample("signin");
}

reset(){
  //this.router.navigate(['/reset']);
}


  async login(){
    if(this.student.username=="" || this.student.username==null || this.student.username==undefined){
      this.toast.presentToast(await this.translateService.get('empty_username').toPromise());
    }
    else if (this.student.password=="" || this.student.password==null || this.student.password==undefined){
      this.toast.presentToast(await this.translateService.get('empty_pass').toPromise());
    }

    else{
      let data = {
        username : this.student.username,
        password : this.student.password
      }
      this.api.login(data).subscribe((data:any)=>{
        //console.log("message", data)
        if(data.message == "Success"){
            //console.log(data.data);
            this.getUser(data.data[0]);
        }
        else{
          //console.log("message", data)
          this.notLogin();
        }
      })
    }
  }

  getUser(user){
    this.user = user;
    if(user.user_id == null){
      this.id = user.classe_id;
    }
    else{
        this.id = user.id;
    }
    let datas = {
      id : this.id
    }
    this.api.getDatas("checkmember", datas).subscribe( async (da:any)=>{
      console.log("RegRDER", da);
      //console.log("RegRDERRegRDERRegRDERRegRDER", da.data.status);
      if(da.data==null){ 
        this.checkmember();
      }
      else{
        if(da.data.status=="1"){
          let start_date = da.data.updated_at;
          let dayss = da.data.membership.periode;
          let end_date = new Date(start_date);
          end_date.setDate(end_date.getDate() + parseInt(dayss));
          console.log(dayss);
          console.log(start_date);
          console.log(end_date);
          let dateNow = new Date();
          console.log(dateNow);
          if(dateNow<end_date){
                //localStorage.setItem('user_data', JSON.stringify(this.user));
                let user = {
                  user_login: true,
                  user : this.user,
                  login : null
                };
                localStorage.setItem('user_owner', JSON.stringify(user));
                let update = "true";
                localStorage.setItem('upadted_score', update);
                //console.log
                if(this.user.langue_id == null){
                  this.testMessage(this.user.first_name); 
                  //this.showSuccess("Welcomme back "+user.first_name, "Success login");
                  //this.router.navigate(['/test']);
                  console.log("Test user")
                  this.play.playOnSuccess();
                  this.routes.urlSample("test");
                }
                else if(this.user.age.years_start == 3){
                    this.mbindiMessage(this.user);

                }
                else if(this.user.age.years_start > 3){
                  this.seniorMessage(this.user.first_name)
                    //this.showSuccess("Welcomme back "+user.first_name, "Success login");
                    //this.router.navigate(['/home']);

                  
                }
                else{
                  console.log("Test user 2")
                  this.play.playOnSuccess();
                    this.routes.urlSample("test");

                }
            }
            else{
               // this.showSWarning("Membership expired", "Membership status")
                this.toast.presentToast(await this.translateService.get('membership_expired').toPromise());
              }
        }
        else{
          //this.showSWarning("Membership not activated", "Membership status")
          this.toast.presentToast(await this.translateService.get('membership_not_activated').toPromise());
        }
      }
    })
  }

  async seniorMessage(user){
    this.toast.presentToast(await this.translateService.get('welcome_user'+user).toPromise());
    this.play.playOnSuccess();
    this.routes.urlSample("/tabs/tab1");
  }


  async mbindiMessage(user){
    this.toast.presentToast(await this.translateService.get('welcome_user'+user.first_name).toPromise());
    let data = {
      item: user.age.id,
      type : "age"
      }
    this.play.playOnSuccess();
    this.routes.urlWithParams("/books", data)
  }

  async testMessage(user){
    this.toast.presentToast(await this.translateService.get('welcome_user'+user).toPromise());
    this.routes.urlSample("test");
  }

  async checkmember(){
    this.toast.presentToast(await this.translateService.get('expired_membership_or_not_activated').toPromise());
  }

  redirectafterLogin(data){

  }

  async notLogin(){
    this.toast.presentToast(await this.translateService.get('error_login_child').toPromise());
  }

}
