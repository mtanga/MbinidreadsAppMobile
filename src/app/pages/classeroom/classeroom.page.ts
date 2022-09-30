import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { RoutesService } from 'src/app/shared/services/routes.service';

@Component({
  selector: 'app-classeroom',
  templateUrl: './classeroom.page.html',
  styleUrls: ['./classeroom.page.scss'],
})
export class ClasseroomPage implements OnInit {
  id: any;
  sub: any;
  classe: any;
  language: string = this.translateService.currentLang; // 2
  students: any= {};
  testAccount: any;


  constructor(
    private route : ActivatedRoute,
    private api : ApiService,
    private translateService: TranslateService,
    private alertController : AlertController,
    private routes : RoutesService,
  ) { }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.id = params['id'];
      this.classe = params['class'];
      this.retrieveClass(this.id);
    });
  }

  
  retrieveClass(id: any) {
    let data ={
      user : this.getUser()?.user.id,
      classe : this.id
    }
    this.api.getDatas("get_class_school", data).subscribe( async (da:any)=>{
      console.log("classes", da)
      console.log("classes", da.message)
      this.students = da.data;
    })
  }

  async edit(){
    const actionSheet = await this.alertController.create({
      header: await this.translateService.get('edit_class').toPromise(),
      message: await this.translateService.get('fill_classroom_name').toPromise(),
      cssClass: 'my-custom-class',
      inputs: [
        {
          name: 'classeroom',
          value: this.classe,
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
          text: await this.translateService.get('edit_class').toPromise(),
          handler: (data) => {
            if(data.classeroom){
              let datas ={
                id : this.id,
                name : data.classeroom
              }
              this.classe = data.classeroom;
              this.api.getDatas("edit_classe", datas).subscribe( async (da:any)=>{
                if(da.success == true){
                  this.classe = data.classeroom;
                  //this.show(text);
                }
                
              })
            }

          }
        }
      
      ]
    });
    await actionSheet.present();
  }

  studentItem(item){
    console.log(item);
    let data = {
      id: item.id
      }
    this.routes.urlWithParams("/profile", data);
  }

  addStudent(){
      let data = {
        id: this.id,
        class : this.classe
        }
      this.routes.urlWithParams("/newstudent", data);
  }

  async show(text){
    await this.translateService.get(text).toPromise();
  }

  getUser(){
    //console.log(JSON.parse(localStorage.getItem('user_owner')));
    //console.log("role", JSON.parse(localStorage.getItem('user_owner'))?.user?.roles[0].title);
    return JSON.parse(localStorage.getItem('user_owner'));
  }

  async deleteClass(){
    const actionSheet = await this.alertController.create({
      header: await this.translateService.get('delete_class').toPromise(),
      message: await this.translateService.get('delete_class_confirm').toPromise(),
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: await this.translateService.get('cancel').toPromise(),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: await this.translateService.get('valdiate').toPromise(),
          handler: (data) => {
              let datas ={
                id : this.id,
              }
              this.api.getDatas("delete_classe", datas).subscribe( async (da:any)=>{
                this.routes.urlSample("/tabs/tab1");
              })
          }
        }
      
      ]
    });
    await actionSheet.present();
  }

}
