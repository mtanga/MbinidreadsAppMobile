import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/shared/services/api.service';
import { SoundService } from 'src/app/shared/services/sound.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {
  language: string = this.translateService.currentLang; // 2
  public loading = false;
  lettre = [
    {
      item : "A",
    },
    {
      item : "B",
    },
    {
      item : "C",
    },
    {
      item : "D",
    },
    {
      item : "E",
    },
    {
      item : "F",
    },
    {
      item : "G",
    },
    {
      item : "H",
    },
    {
      item : "I",
    }
  ]

  nextlevel : boolean = false;
  nextlevelOptions : boolean = false;
  active: boolean = false;
  sub: any;
  item: any;
  userInfo: any;
  user: any;
  quiz: any = [];
  plus : number = 0;
  @Input() idQuiz: number = 0;
  speech: any;

  items = [];
  pageOfItems: Array<any>;
  selectedWord: any | null;

  selected: any | null;
  actu: boolean;

  score : number = 0;
  scoreActu: any;
  nextShow: boolean = true;
  book: any;
  type: any;
  AllReadsBooks: any;
  deja: boolean = false;
  trouve: { id: any; lui: any; quiz:any;};
  myArray: any = [];
  mesPoints: any = 0;
  status: boolean = false;
  itemActu: any;
  lost: boolean = false;
  normalResponse: boolean = true;
  constructor(
    private translateService: TranslateService,
    private con: ApiService,
    private route : ActivatedRoute,
    private router: Router,
    private play: SoundService,
    protected sanitizer: DomSanitizer,
    private _location: Location,
    private toast : ToastService,
    private toastr: ToastService,
  ) 
  { }


  ngOnInit(): void {
    this.loading = true;
    console.log(this.lettre)
    //this.items = Array(150).fill(0).map((x, i) => ({ id: (i + 1), name: `Item ${i + 1}`}));
    this.userInfo = localStorage.getItem('user_owner');
    if(this.userInfo){
      this.user = JSON.parse(this.userInfo);
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      console.log(params.item);
      this.item = params.item;
      this.book = params.book;
      this.type = params.type;
      this.getQuiz(this.item);
    });
  }
  }

  clickEvent(item){
    console.log(item);
   // this.status = !this.status;  
   this.itemActu = item 
  }

  getQuiz(item){
    let ressource = {
      id : item
    }
    this.con.getDatas("getquiz", ressource).subscribe( async (da:any)=>{
      console.log(da.data);
      this.quiz = da.data;
      this.items = this.quiz;
      console.log("taille du quiz", this.quiz);
      this.plus = 0;
      console.log("taille du quiz 2", this.quiz[this.plus]);
      
      this.readQuiz(item)

    })
  }

  readQuiz(id){
    this.deja = false;
    let livre ={
      student : this.user.id,
      ressource : id
    }
    this.con.getDatas("quizread", livre).subscribe( async (da:any)=>{
      console.log("LL Dr", da)
      if(da.data.length>0){
        this.AllReadsBooks = da.data;
        if(this.AllReadsBooks[0].status == "read"){
          this.deja = true;
      }
      }
    })
  }






  previousstep(plus, item, quiz){
    console.log(item)
    console.log(quiz)
    console.log(plus)
    this.score = this.score + this.scoreActu;
    this.plus = plus - 1;
    this.scoreActu = 0;
    console.log("iddddddd", plus)
    console.log(this.score);
  }

totalPoints(){
  let arr = JSON.parse(localStorage.getItem('user_owner') || "");
  this.mesPoints = 0;
  arr.forEach(element => {
    if(element.response == 1){
      this.mesPoints = this.mesPoints + 1
    }
  });
  return this.mesPoints
}

async nextstep(plus, item, quiz){
  console.log(this.checkIfCHoose(quiz));
  if(this.checkIfCHoose(quiz)==false){
   // console.log("Mes question", JSON.parse(localStorage.getItem('user_owner') || ""));
   // console.log("question", quiz);
   // console.log(this.checkIfCHoose(quiz));
    //console.log(JSON.parse(localStorage.getItem('user_owner') || ""));
    //this.toastr.warning("You must choose answer to continue.", "Error");
    this.toast.presentToast(await this.translateService.get('ypu_mus_choose_question_to_continue').toPromise());
  }
  else{
    this.plus = plus + 1;
  }
}

  async validate(plus, item, quiz){
    if(this.checkIfCHoose(quiz)==false){
    // this.toastr.warning("You must choose answer to continue.", "Error");
      this.toast.presentToast(await this.translateService.get('ypu_mus_choose_question_to_continue').toPromise());
    }
    else{
      let pointObject = JSON.parse(localStorage.getItem('user_owner') || "");
      console.log(this.quiz);
      console.log(pointObject);
      console.log(pointObject.length);
      console.log(this.quiz.length);
  
      console.log("Mes points", this.countPoints());
      (3*100/5) 
      let pourcentage = this.countPoints()*100/this.quiz.length;
      console.log("Mon pourcentage", pourcentage);
      this.score = this.countPoints();
      
      if(pourcentage==100){
        this.addScore(this.countPoints());
      }
  
      else if(pourcentage>50 ){
       this.play.playOnLowScoreMoyen()
       this.normalResponse = false;
       this.lost = false;
       //this.level = false;
       this.nextlevelOptions = true;
   
  
      }
  
      else{
  
        this.normalResponse = false;
        this.play.playOnLowScore();
        this.lost = true;
      }
    }


  }

  validateOnly(plus, item, quiz){
    let pointObject = JSON.parse(localStorage.getItem('user_owner') || "");
    console.log(this.quiz);
    console.log(pointObject);
    console.log(pointObject.length);
    console.log(this.quiz.length);

    console.log("Mes points", this.countPoints());
    (3*100/5) 
    let pourcentage = this.countPoints()*100/this.quiz.length;
    console.log("Mon pourcentage", pourcentage);
    this.score = this.countPoints();
    
    if(pourcentage>50 ){
      this.addScoret(this.countPoints());
    }

    else{

      this.normalResponse = false;
      this.play.playOnLowScore();
      this.lost = true;
      
     // console.log(this.lost)
    }

  }

  lostRedirect(){
    this.router.navigate(['/repeat'], { queryParams: {
      item: this.item,
      book : this.book,
      type : this.type,
       }
     });
  }

  countPoints(){
    let pointObject = JSON.parse(localStorage.getItem('user_owner') || "");
    let toPoints = 0;
    pointObject.forEach(element => {
      toPoints = toPoints + parseInt(element.response);
    });
    return toPoints;
  }

  addScore(score){
    let reads = {
      points : score,
      student_id : this.user.id,
    }
    this.con.getDatas("addscore", reads).subscribe( async (da:any)=>{
      console.log(da);
      //this.book = da.data[0];
    })
    localStorage.removeItem('user_owner');
    this.markRead(this.quiz[0]);
  }


  addScoret(score){
    let reads = {
      points : score,
      student_id : this.user.id,
    }
    this.con.getDatas("addscore", reads).subscribe( async (da:any)=>{
      console.log(da);
      //this.book = da.data[0];
    })
    localStorage.removeItem('user_owner');
    this.markReadt(this.quiz[0]);
  }

  markRead(quiz) {
    //console.log(quiz)
    let reads = {
      status : "read",
      type : "quiz",
      student : this.user.id,
      ressource : quiz.ressource.id
    }
    this.con.getDatas("addreading", reads).subscribe( async (da:any)=>{
      console.log(da);
      //this.book = da.data[0];
    })
    this.nextlevel = true;
    this.normalResponse = false;

    //this.nextlevel = true;
    console.log(this.nextlevel)
    //this.play.playOnClick();
    this.play.playOnSuccess();
    this.play.playOnSuccessNext();


  }



  markReadt(quiz) {
    //console.log(quiz)
    let reads = {
      status : "read",
      type : "quiz",
      student : this.user.id,
      ressource : quiz.ressource.id
    }
    this.con.getDatas("addreading", reads).subscribe( async (da:any)=>{
      console.log(da);
      //this.book = da.data[0];
    })
    this.return();
   // this.nextlevel = true;
   // this.normalResponse = false;

    //this.nextlevel = true;
    //console.log(this.nextlevel)
    //this.play.playOnClick();
   // this.play.playOnSuccess();
  //  this.play.playOnSuccessNext();


  }
  return (){
    this.router.navigate(['/books'], { queryParams: {
      item: this.book,
      type : this.type
       }
     });
     ///this.nextlevel = false;
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
}




checkIfCHoose(quiz){
  let retour = false;
  console.log(localStorage.getItem('is_user_score'));
  if(localStorage.getItem('is_user_score')!=null){
    JSON.parse(localStorage.getItem('is_user_score') || "").forEach(element => {
      console.log("question ici", quiz)
      if(element.quiz == quiz.id){
        retour = true;
      }
    });
  }
  else{
    console.log("ici");
    retour = false;
  }
  return retour;
}


choose(item, quiz){
  this.itemActu = item 
  console.log("quiz", quiz);
  let data = {
    id : item.id,
    quiz : quiz.id,
    response : item.choose,
    item : quiz,
  } 
  if(localStorage.getItem('is_user_score')==null){
    console.log("Jetais pas là")
     this.myArray.push(data);
      localStorage.setItem('is_user_score', JSON.stringify(this.myArray));
  }
  else{
    console.log("Je suis là deja")
    //var test = localStorage.getItem('is_user_score');
    let arr = JSON.parse(localStorage.getItem('is_user_score') || "");
    console.log("Mes points", arr);
    console.log("Mes points longueur", arr.length);

        if(this.checkPoint(arr, quiz.id).trouver==true){
          console.log("Je me modifie", quiz.id)
        //  console.log("Je me modifie", this.checkPoint(arr, quiz.id).quiz)
          console.log("Je me modifie", this.checkPoint(arr, quiz.id))
          console.log("Trouve", this.checkPoint(arr, quiz.id));
          console.log("repo", item);
        arr[this.checkPoint(arr, quiz.id).index].response = item.choose;
        arr[this.checkPoint(arr, quiz.id).index].id = item.id;
        localStorage.setItem('is_user_score', JSON.stringify(arr));
        console.log("repo", JSON.parse(localStorage.getItem('is_user_score') || ""));
        }
        else{
          console.log("Je m ajoute")
          arr.push(data);
          localStorage.setItem('is_user_score', JSON.stringify(arr));
        }
    
  }
    console.log("Modifié", localStorage.getItem('is_user_score'));
}


  checkPoint(item, quiz){
    var i = item.length;
    let lui = {
       trouver : false,
       index : ""
    }
    while (i--) {
       if (item[i].quiz === quiz) {
            let lui = {
                trouver : true,
                index : i
            }
           return lui;
       }
    }
    return lui;
//}
  }


  backClicked() {
    if(confirm("Are you sure ?")) {
      this._location.back();
    }
    
  }

  listen(text){
    this.play.listen(text);


  }
}
