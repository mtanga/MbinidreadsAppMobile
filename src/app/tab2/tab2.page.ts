import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../shared/services/api.service';
import { RoutesService } from '../shared/services/routes.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ToastService } from '../shared/services/toast.service';
import { SoundService } from '../shared/services/sound.service';




@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  language: string = this.translateService.currentLang; // 2
   memberships : any = [];
   @ViewChild(IonModal) modal: IonModal;

  membershipp : any;
  availableMemberships: any;
  classes: any;
  currentFood = undefined;
  obj: any;
  eleve: string;
  studentParent: any;

  userInfo: any | null;
  user: any | null;
  score: any;
  countressources: any;
  countR: any;
  countReding: any;
  themes : any = [];
  subjects : any = [];
  genres : any = [];
  countbooklevels: any;

  constructor(
    private translateService: TranslateService,
    private api : ApiService,
    private routes : RoutesService,
    private alertController : AlertController,
    private toast : ToastService,
    private play: SoundService,
  ) {}


  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('user_owner'));
    if(user?.user?.roles!=undefined){
      if(JSON.parse(localStorage.getItem('user_owner')).user.roles[0].title == "School"){
        this.getMembershipsSchool(JSON.parse(localStorage.getItem('user_owner')).user.id);
      }
      else if(JSON.parse(localStorage.getItem('user_owner')).user.roles[0].title == "Parent"){
        this.getMembershipsParent(JSON.parse(localStorage.getItem('user_owner')).user.id);
      }
    }
    else{
      this.user = JSON.parse(localStorage.getItem('user_owner')).user;
      this.getthemes();
    }
  }

  getthemes(){
    this.api.getData("themes").subscribe( async (da:any)=>{
      console.log(da);
      this.themes = da.data;
    })
    this.getgenres();
  }


  getgenres() {
    this.api.getData("genres").subscribe( async (da:any)=>{
      console.log(da);
      this.genres = da.data;
    })
    this.getsubjects();
  }


  getsubjects() {
    this.api.getData("subjects").subscribe( async (da:any)=>{
      console.log(da);
      this.subjects = da.data;
     // this.loading = false;
    })
  }

  goToBooks(id, type){
    this.play.playOnClick();
    let data = {
       item: id,
       type : type
      }
    this.routes.urlWithParams("books", data);
  }

  getUser(){
  //  console.log(JSON.parse(localStorage.getItem('user_owner')));
   // console.log("role", JSON.parse(localStorage.getItem('user_owner'))?.user?.roles[0].title);
    return JSON.parse(localStorage.getItem('user_owner'));
  }


  getMembershipsParent(id: any) {
    let data ={
        id : id
      }
  this.api.getDatas("get_memeberships", data).subscribe( async (da:any)=>{
    console.log("infos parent", da)
    this.memberships = da.data;
    this.getMembershipss();
  })//
}



  getMembershipsSchool(id: any) {
        let data ={
            id : id
          }
    this.api.getDatas("get_memeberships", data).subscribe( async (da:any)=>{
      console.log("infos", da)
       this.memberships = da.data;
       this.getMemberships();
    })//
  }


  getMembershipss(){
    let data ={
      id : JSON.parse(localStorage.getItem('user_owner')).user.id
    }
    this.api.getDatas("getavailblememebership", data).subscribe( async (da:any)=>{
      console.log("getavailblememebership", da)
       this.availableMemberships = da.data;
       this.getStudent(JSON.parse(localStorage.getItem('user_owner')).user.id);
    })
  }

  getStudent(id){
    let data ={
      id : id
    }
    this.api.getDatas("getstudents", data).subscribe( async (da:any)=>{
      console.log("studentParent", da)
      this.studentParent = da.data.student;
    })
  }

  getClasses(id){
    let data ={
      id : id
    }
    this.api.getDatas("get_classes", data).subscribe( async (da:any)=>{
      console.log("classes", da)
      this.classes = da.data;
    })
  }



  getMemberships(){
    let data ={
      id : JSON.parse(localStorage.getItem('user_owner')).user.id
    }
    this.api.getDatas("getavailblememebership", data).subscribe( async (da:any)=>{
      console.log("getavailblememebership", da)
       this.availableMemberships = da.data;
       this.getClasses(JSON.parse(localStorage.getItem('user_owner')).user.id);
    })
  }

  compareWith(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  handleChange(ev) {
   // this.currentFood = ev.target.value;
    this.obj = this.availableMemberships.find(o => o.id === ev.target.value)
    console.log("objet", this.obj);


    console.log("ici et ici", this.obj);
  }


  addDays(date, days) {
    var result = new Date(date);
    let dayss = parseInt(days);
    result.setDate(result.getDate() + dayss);
    return result;
  }


  formatDate(date){
    var d = new Date(date);
    var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
    d.getHours() + ":" + d.getMinutes();
    return datestring;
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

  async pay(){
    if(this.membershipp=="" || this.membershipp==null || this.membershipp==undefined){
      this.toast.presentToast(await this.translateService.get('choose_membership').toPromise());
    }
    else if(this.eleve=="" || this.eleve==null || this.eleve==undefined){
      this.toast.presentToast(await this.translateService.get('choose_class').toPromise());
    }
    else{
      let data = {
        membership : this.membershipp,
        user : JSON.parse(localStorage.getItem('user_owner'))?.user?.id,
        classe : this.eleve
      }
      this.api.getDatas("add_memeberships", data).subscribe( async (da:any)=>{
        if(da.success == true){  
          this.getMembershipsSchool(JSON.parse(localStorage.getItem('user_owner')).user.id);
          this.modal.dismiss('confirm');
        }
        
      })
    }
  }

  async payForParent(){
    if(this.membershipp=="" || this.membershipp==null || this.membershipp==undefined){
      this.toast.presentToast(await this.translateService.get('choose_membership').toPromise());
    }
    else if(this.eleve=="" || this.eleve==null || this.eleve==undefined){
      this.toast.presentToast(await this.translateService.get('choose_class').toPromise());
    }
    else{
      let data = {
        membership : this.membershipp,
        user : JSON.parse(localStorage.getItem('user_owner'))?.user?.id,
        student : this.eleve
      }
      this.api.getDatas("add_memeberships_parent", data).subscribe( async (da:any)=>{
        if(da.success == true){ 
          this.getMembershipsParent(JSON.parse(localStorage.getItem('user_owner')).user.id); 
          this.modal.dismiss('confirm');
          
        }
        
      })
    }
  }

  formatPrice(price){
    if(price!=undefined){
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }



}
