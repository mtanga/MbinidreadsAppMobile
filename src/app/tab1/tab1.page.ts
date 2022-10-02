import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/services/api.service';
import { RoutesService } from '../shared/services/routes.service';
import { SoundService } from '../shared/services/sound.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  timerSubscription: Subscription; 
  language: string = this.translateService.currentLang; // 2
  classes: any;
  studentparents: any = [];
  studenttestparent: any;

  userInfo: any | null;
  user: any | null;
  score: any;
  countressources: any;
  countR: any;
  countReding: any;
  levels : any = [];
  countbooklevels: any;
  books: any;
  AllReadsBooks: any;
  new_levels : any = [];

  constructor(
    private translateService: TranslateService,
    private api : ApiService,
    private routes : RoutesService,
    private alertController : AlertController,
    private play: SoundService,
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
    let user = JSON.parse(localStorage.getItem('user_owner'));
    this.getUser();
    console.log("user student", user);
    if(user?.user?.roles!=undefined){
        if(user.user?.roles[0].title=='School'){
          this.getclasses(user.user.id);
        }
        else if (user.user?.roles[0].title=='Parent'){
          this.getstudents(user.user.id);
        }
    }
    else{
      this.userInfo = JSON.parse(localStorage.getItem('user_owner'));
      if(this.userInfo){
        this.user = JSON.parse(localStorage.getItem('user_owner')).user;
        this.getlevels(this.user);
      }
    }
  }

  getlevels(user) {
    console.log(user)
    let datas = {
      langue : user.langue_id,
      age : user.age.id,
      student : user.id
    }
    this.api.getDatas("getlevelsWithReading", datas).subscribe( async (da:any)=>{
      console.log("Mes livres", da);
      this.newOrder(da.data);
    })
  }

  newOrder(item){
    this.books = item.sort((a, b) => parseInt(a.level.order) - parseInt(b.level.order));
    console.log("ancien ordre", this.books)
    //this.loading = false;

  }

  getLeveledBooks(user){
    console.log(user)
    let datas = {
      langue : user.langue_id,
      //level : id,
      age : user.age.id,
      student : user.id
    }
    this.api.getDatas("getlevelsWithReading", datas).subscribe( async (da:any)=>{
      console.log("Mes livres", da);
      this.books = da.data;
      //this.getAllReadsBook();
    })
    return this.books;
  }

  opacityItem(books, index){
    console.log(index)
    console.log("books", books)
      if(index == 0){
        return true
      }
      else if(books[index-1].all_books > books[index-1].books_readed || books[index-1].all_books==0){
        return false
      }
      else{
        return true;
      }
      
  }

  filterLevels(levels){
    return levels.sort((a, b) => parseInt(a.price) - parseInt(b.price));
  }


  goToBooks(books, index, id){
    if(this.opacityItem(books, index)==true){
      this.play.playOnClick();
      let data =  {
         item: id,
         type : "level"
        }
      this.routes.urlWithParams("books", data)
    }
    
  }



  getAllReadsBook(){
    let livre ={
      student : this.user.id
    }
    this.api.getDatas("getreading", livre).subscribe( async (da:any)=>{
      this.AllReadsBooks = da.data;
      console.log("livre lu ?", da);
     // this.getReadsBook();
    })
    return this.AllReadsBooks;
}




  getstudents(id){
    let data ={
      id : id
    }
    this.api.getDatas("getstudents", data).subscribe( async (da:any)=>{
      console.log("Students", da)
      this.studentparents = da.data.student;
      this.studenttestparent = da.data.test;
    })
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
      id: JSON.parse(localStorage.getItem('user_owner'))?.user?.id,
      }
    this.routes.urlWithParams("/newstudent", data);
}


  getUser(){
   // console.log(JSON.parse(localStorage.getItem('user_owner')));
  //  console.log("role", JSON.parse(localStorage.getItem('user_owner'))?.user?.roles[0].title);
    return JSON.parse(localStorage.getItem('user_owner'));
  }

  getclasses(id){
    let data ={
      id : id
    }
    this.api.getDatas("get_classes", data).subscribe( async (da:any)=>{
      console.log("classes", da)
      this.classes = da.data;
    })
  }

  classeItem(item){

    let data = {
      id: item.id,
      class : item.name
      }
    this.routes.urlWithParams("/classeroom", data)
  }


  async addClass(){
    const actionSheet = await this.alertController.create({
      header: await this.translateService.get('new_class').toPromise(),
      message: await this.translateService.get('fill_classroom_name').toPromise(),
      cssClass: 'my-custom-class',
      inputs: [
        {
          name: 'classeroom',
          placeholder: await this.translateService.get('class_name').toPromise(),
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
          text: await this.translateService.get('create').toPromise(),
          handler: (data) => {
            if(data.classeroom){
              let datas ={
                user : this.getUser()?.user?.id,
                name : data.classeroom
              }
              this.api.getDatas("add_classe", datas).subscribe( async (da:any)=>{
                //console.log("classes", da)
                if(da.success == true){
                  this.show("class_added");
                  this.getclasses(this.getUser()?.user?.id);
                }
                
              })
            }

          }
        }
      
      ]
    });
    await actionSheet.present();
  }

  isEmpty(str) {
    return (!str || str.length === 0 );
}

  async createClass(classe){
    console.log(classe)
    if(!classe){
      await this.translateService.get('fill_classroom_name').toPromise();
    }
    else{

    }
  }

  async show(text){
    await this.translateService.get(text).toPromise();
  }

}
