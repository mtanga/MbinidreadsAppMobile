import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { NetworkService } from 'src/app/shared/services/network.service';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { SoundService } from 'src/app/shared/services/sound.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import {CarouselModule} from 'primeng/carousel';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  student: any;

    sub: any;
    item: any;
    type: number;
    books : any = [];
    Booksreturned : any = [];
    reading : any = [];
    mbindi : boolean = false;

      //images; 
  responsiveOptions;


  //public loading = false;

  userInfo: any | null;
  user: any | null;
  clicked: boolean = false;
  items: any;
  checked: any;
  AllReadsBooks: any;
  vrai: boolean;
  readNote: number;
  hearNote: number;
  quizNote: number;
  itemi: any;
  images: any[];
  newBook: any[];



  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;
  @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;

  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;


  constructor(
    private routes : RoutesService,
    private translateService: TranslateService,
    private network : NetworkService,
    private api : ApiService,
    private toast : ToastService,
    private play : SoundService,
    config: NgbPopoverConfig
  ) {
            // customize default values of popovers used by this component tree
            config.placement = 'center-center';
            config.triggers = 'click';
    
            this.responsiveOptions = [{
              breakpoint: '1024px',
              numVisible: 1,
              numScroll: 3
          }];
   }

  ngOnInit() {
    if(JSON.parse(localStorage.getItem('user_owner'))){
      this.student = JSON.parse(localStorage.getItem('user_owner'));
      console.log("User", this.student)
      this.api.getData("testnewbooks").subscribe( async (da:any)=>{
        console.log(da);
        this.newBook = da.data;
        console.log("Nouveau", this.newBook);
        
        this.getBooks()
      })
    }
      else{

      }

  }


    //Move to Next slide
    slideNext(object, slideView) {
      slideView.slideNext(500).then(() => {
        this.checkIfNavDisabled(object, slideView);
      });
    }
  
    //Move to previous slide
    slidePrev(object, slideView) {
      slideView.slidePrev(500).then(() => {
        this.checkIfNavDisabled(object, slideView);
      });;
    }
  
    //Method called when slide is changed by drag or navigation
    SlideDidChange(object, slideView) {
      this.checkIfNavDisabled(object, slideView);
    }
  
    //Call methods to check if slide is first or last to enable disbale navigation  
    checkIfNavDisabled(object, slideView) {
      this.checkisBeginning(object, slideView);
      this.checkisEnd(object, slideView);
    }
  
    checkisBeginning(object, slideView) {
      slideView.isBeginning().then((istrue) => {
        object.isBeginningSlide = istrue;
      });
    }
    checkisEnd(object, slideView) {
      slideView.isEnd().then((istrue) => {
        object.isEndSlide = istrue;
      });
    }


  getBooks(){
    this.api.getData("testressources").subscribe( async (da:any)=>{
      console.log(da);
      this.books = da.data;
      this.getAllReadsBook();
    })
  }

  getAllReadsBook(){
    let livre ={
      student : this.student?.user?.id
    }
    this.api.getDatas("getreading", livre).subscribe( async (da:any)=>{
      this.AllReadsBooks = da.data;
      //console.log(this.AllReadsBooks);

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
    this.Booksreturned.push(item)
    //console.log(elt, this.checkRead(elt))
  })
console.log("Filtré", this.Booksreturned); 
//this.loading = false;
}

  checkRead(livre){
  this.readNote = 0;
  this.hearNote = 0;
  this.quizNote = 0;
  console.log(this.AllReadsBooks.length-1)
    for(let i=0; this.AllReadsBooks.length>i;i++){
        if(this.AllReadsBooks[i].ressource_id == livre.id && this.AllReadsBooks[i].student_id == this.student?.user?.id && this.AllReadsBooks[i].type == "read"){
          this.readNote = 1;
        }
        if(this.AllReadsBooks[i].ressource_id == livre.id && this.AllReadsBooks[i].student_id == this.student?.user?.id && this.AllReadsBooks[i].type == "hear"){
          this.hearNote = 1;
      }
      if(this.AllReadsBooks[i].ressource_id == livre.id && this.AllReadsBooks[i].student_id == this.student?.user?.id && this.AllReadsBooks[i].type == "quiz"){
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
    
    this.api.getDatas("logout", userr).subscribe( async (da:any)=>{
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
