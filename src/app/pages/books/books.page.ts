import { Component, ComponentFactoryResolver, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {CarouselModule} from 'primeng/carousel';
import {Location} from '@angular/common';
import { SoundService } from 'src/app/shared/services/sound.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { RoutesService } from 'src/app/shared/services/routes.service';

import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from "@angular/platform-browser";

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  public loading = false;
  sub: any;
  urlSafe: SafeResourceUrl;
  item: any = [];
  type: number;
  books : any = [];
  Booksreturned : any = [];
  reading : any = [];
  mbindi : boolean = false;
  //private _subscription:Subscription;
  isModalOpen : boolean = false;
  hearing : boolean = false;

  //images; 
  responsiveOptions;




  userInfo: any | null;
  user: any | null;
  clicked: boolean = false;
  items: any = [];
  checked: any;
  AllReadsBooks: any;
  vrai: boolean;
  readNote: number;
  hearNote: number;
  quizNote: number;
  itemi: any;
  images: any[];
  newBook: any[];
  clickeds: boolean = false;
  itemss: any = [];
  newOpened: boolean;
  opened: boolean;
  intervalS: number = 15000;
  student: any;
  language: string = this.translateService.currentLang; // 2
  infos: any;
  infosHearing: any;
  readingOnly: boolean = false;
  infosreading: any;




  constructor(
    private route : ActivatedRoute,
    private router:Router,
    private con: ApiService,
    private play: SoundService,
    protected sanitizer: DomSanitizer,
    private _location: Location,
    private toast : ToastService,
    private routes : RoutesService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.student = JSON.parse(localStorage.getItem('user_owner')).user;
    this.userInfo = this.student;
    if(this.student.langue_id == null){
      this.router.navigate(['/test']);
    }


    if(this.userInfo){
      this.user = this.student;
      if(this.user.age.years_start == 3){
        this.mbindi = true;
      }
      else{
        this.mbindi = false;
        console.log("TU es senior")
      }
      this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log(params.type);
        this.item = params.item;
        this.type = params.type;
        let datas = {
          langue : this.user.langue_id,
          age : this.user.age.id,
        }
        this.con.getDatas("getnewbooks", datas).subscribe( async (da:any)=>{
          console.log(da);
          this.newBook = da.data;
          console.log("Nouveau", this.newBook);
          this.getBooks(this.user, this.item, this.type)
        })
      });
    }
    else{
      this.router.navigate(['/login']);
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.isModalOpen = false;
  }

  confirm() {
    this.isModalOpen
    this.modal.dismiss('confirm');
  }

  openBook(item){
    this.isModalOpen = !this.isModalOpen
    this.play.playOnClick();
    this.infos = item;
    console.log("items", this.infos);
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      //this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  clikced(){
    this.play.playOnClick();
  }

  changeText(){
    this.intervalS = 0;
    console.log(this.intervalS);
  }


  backClicked() {
    this._location.back();
  }
  
  hovered(){
    this.play.playOnHover();
  }

  getBooks(user, item: any, type: any) {
    if(type=="level"){
      console.log("level ici");
      this.getLeveledBooks(user, item);
    }
    if(type=="subject"){
      //alert(2)
      this.getSubjectsBooks(user, item);
    }
    if(type=="theme"){
      //alert(2)
      this.getThemesBooks(user, item);
    }
    if(type=="genre"){
      //alert(2)
      this.getGenresBooks(user, item);
    }
    if(type=="age"){
      //alert(2)
      this.getTAgeBooks(user, item);
    }
  }

  moadalOpen(item){
    this.play.playOnClick();
    this.opened = true;
    this.clicked = true;
    this.items = item;

  }



  moadalOpens(item){
    this.play.playOnClick();
    this.newOpened = true;
    console.log(item);
    this.clickeds = true;
    this.itemss = item;

  }

  // Afficher un langue sélectionnée
  moadalclose(){
    this.clicked = false;
    this.newOpened = false;
    this.opened = false;
   }



  getLeveledBooks(user, id){
    console.log(user)
    let datas = {
      langue : user.langue_id,
      level : id,
      age : user.age.id,
    }
    this.con.getDatas("getleveledressources", datas).subscribe( async (da:any)=>{
      console.log("Mes livres", da);
      this.books = da.data;
      this.getAllReadsBook();
    })
  }

  getSubjectsBooks(user, id){
    console.log(user)
    let datas = {
      langue : user.langue_id,
      subject_id : id,
      age : user.age.id,
    }
    this.con.getDatas("getsubjectsressources", datas).subscribe( async (da:any)=>{
      console.log(da);
      this.books = da.data;
      this.getAllReadsBook();
    })
  }

  getThemesBooks(user, id){
    console.log(user)
    let datas = {
      langue : user.langue_id,
      theme_id : id,
      age : user.age.id,
    }
   // let test = false;
   // if(test==false){
    this.con.getDatas("getthemesressources", datas).subscribe( async (da:any)=>{
        console.log(da);
        this.books = da.data;
        this.getAllReadsBook();
      })
      //.unsubscribe()
   // }
   // test=true;
   //this.con.getDatas("getthemesressources", datas).unsubscribe();

  }

  getGenresBooks(user, id){
    console.log(user)
    let datas = {
      langue : user.langue_id,
      genre_id : id,
      age : user.age.id,
    }
    this.con.getDatas("getgenresressources", datas).subscribe( async (da:any)=>{
      console.log(da);
      this.books = da.data;
      this.getAllReadsBook();
    })
  }


  getTAgeBooks(user, id){
    console.log(user)
    let datas = {
      langue : user.langue_id,
      age_id : id
    }
    this.con.getDatas("getageressources", datas).subscribe( async (da:any)=>{
      console.log(da);
      this.books = da.data;
      this.getAllReadsBook();
    })
  }


  read(item){
    this.play.playOnHover();
    //console.log("A ecouter", item);
    this.infosreading = item;
    this.isModalOpen = false;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.infosreading.book.reading.replace(/\s/g, ''));
    this.readingOnly = true;
  }


  hear(item){
    this.play.playOnHover();
    //console.log("A ecouter", item);
    this.infosHearing = item;
    this.isModalOpen = false;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.infosHearing.book.spoken.replace(/\s/g, ''));
    this.hearing = true;

  }

  goQuiz(id){
    console.log("jjj")
    this.modal.dismiss(null, 'cancel');
    this.hearing = false;
    this.readingOnly = false;
    this.play.playOnHover();
    
      this.router.navigate(['/quiz'], { queryParams: {
        item: id,
        book : this.item,
        type : this.type,
         }
       });
  }



  exitt(){
    this.hearing = false;
    this.readingOnly = false;
  }

  async quiz(item){
    this.modal.dismiss(null, 'cancel');
    this.hearing = false;
    this.readingOnly = false;
    if(item.reading?.quiz==1){
      //this.toastr.warning("You have already do this quiz.", "Your request");
      this.toast.presentToast(await this.translateService.get('already_do_quiz').toPromise());
    }
    else{

      this.play.playOnHover();
      this.clicked = false;
      this.router.navigate(['/quiz'], { queryParams: {
        item: item.book.id,
        book : this.item,
        type : this.type,
         }
       });
    }

  }

  getAllReadsBook(){
      let livre ={
        student : this.user.id
      }
      this.con.getDatas("getreading", livre).subscribe( async (da:any)=>{
        this.AllReadsBooks = da.data;
        console.log("livre lu ?", da);
        this.getReadsBook();
      })
  }
  

  getReadsBook(){
      this.books.forEach(elt=>{
        //this.itemi = elt;
        //console.log(elt);
        //this.checkRead(elt);
        let item = {
           book : elt,
           reading :this.checkRead(elt)
        }
        this.Booksreturned.push(item);
        //console.log(elt, this.checkRead(elt))
      })
    console.log("Filtré là", this.Booksreturned); 
    this.loading= false;
  }

  checkRead(livre){
    this.readNote = 0;
    this.hearNote = 0;
    this.quizNote = 0;
   // console.log(this.AllReadsBooks.length-1)
      for(let i=0; this.AllReadsBooks.length>i;i++){
          if(this.AllReadsBooks[i].ressource_id == livre.id && this.AllReadsBooks[i].student_id == this.user.id && this.AllReadsBooks[i].type == "read"){
            this.readNote = 1;
          }
          if(this.AllReadsBooks[i].ressource_id == livre.id && this.AllReadsBooks[i].student_id == this.user.id && this.AllReadsBooks[i].type == "hear"){
            this.hearNote = 1;
        }
        if(this.AllReadsBooks[i].ressource_id == livre.id && this.AllReadsBooks[i].student_id == this.user.id && this.AllReadsBooks[i].type == "quiz"){
          this.quizNote = 1;
        } 
      }
    let lecture = {
      read : this.readNote | 0,
      hear : this.hearNote | 0,
      quiz : this.quizNote | 0
      };

  return lecture;
  }

  
  logout(id){
    let userr = {
      id : id
    }
    
    this.con.getDatas("logout", userr).subscribe( async (da:any)=>{
      console.log(da);
      if(da){
          localStorage.removeItem('user_owner');
          this.play.playOnSuccess();
          this.toast.presentToast(await this.translateService.get('bye'+this.student?.user?.first_name).toPromise());
          this.routes.urlSample("login");
      }
    })  
  }


}
