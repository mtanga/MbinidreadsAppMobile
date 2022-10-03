import { Component, Input, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { SoundService } from 'src/app/shared/services/sound.service';

@Component({
  selector: 'app-repeat',
  templateUrl: './repeat.page.html',
  styleUrls: ['./repeat.page.scss'],
})
export class RepeatPage implements OnInit {
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
  active: boolean = false;
  sub: any;
  item: any;
  nextlevelOptions : boolean = false;
  userInfo: any;
  user: any;
  quiz: any;
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
  reste: any;


  constructor(
    private _location: Location,
    private route : ActivatedRoute,
    private con: ApiService,
    private router: Router,
    private play: SoundService,
  ) { }

  ngOnInit(): void {
    this.reste = this.filterGoodResults();
    console.log("le reste", this.reste)
   // this.loading = true;
    console.log(this.lettre)
    //this.items = Array(150).fill(0).map((x, i) => ({ id: (i + 1), name: `Item ${i + 1}`}));
    this.userInfo = localStorage.getItem('user_data');
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



  filterGoodResults(){
  if(localStorage.getItem('is_user_score')==null){
    this.return();
  }
  else{
    let results = [];
    JSON.parse(localStorage.getItem('is_user_score') || "").forEach(element => {
      if(element.response == '0'){
        results.push(element);
      }
    });
    return results;
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
      this.items = this.quiz
      console.log("taille",da.data.length);
      
      this. readQuiz(item)

    })
  }

  readQuiz(id){
    let livre ={
      student : this.user.id,
      ressource : id
    }
    this.con.getDatas("quizread", livre).subscribe( async (da:any)=>{
      this.AllReadsBooks = da.data;
      this.loading = false;
      console.log(this.AllReadsBooks);
      if(this.AllReadsBooks[0]?.status == "read"){
          this.deja = true;
      }
    })
  }



  nextstep(plus, item, quiz){
    //if(this.reste<this.plus){

    //}

    console.log("item", item)
    console.log("quiz", quiz)
    console.log("le plus", plus)
    console.log("Mes reponses", JSON.parse(localStorage.getItem('is_user_score') || ""))
   // this.score = this.score + this.scoreActu;
    this.plus = plus + 1;
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
  let arr = JSON.parse(localStorage.getItem('is_user_score') || "");
  this.mesPoints = 0;
  arr.forEach(element => {
    if(element.response == 1){
      this.mesPoints = this.mesPoints + 1
    }
  });
  return this.mesPoints
}

testAllQuestions(){
  let pointObject = JSON.parse(localStorage.getItem('is_user_score') || "");
  let tous = 0
  pointObject.forEach(element => {
    if(element.response == "0"){
      tous = tous + 1;
      console.log("ici et cici", element);
    }
    
  });
  //return tous;
  console.log("answers", pointObject);
  console.log("Fini ?", tous)
   return tous;
}

validate(plus, item, quiz){
  let pointObject = JSON.parse(localStorage.getItem('is_user_score') || "");
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
    console.log(pourcentage);
   this.play.playOnLowScoreMoyen()
   this.normalResponse = false;
   this.lost = false;
   this.nextlevel==false;
   this.nextlevelOptions = true;


  }

  else{

    this.normalResponse = false;
    this.play.playOnLowScore();
    this.lost = true;
    
   // console.log(this.lost)
  }

}

validateOnly(plus, item, quiz){
  let pointObject = JSON.parse(localStorage.getItem('is_user_score') || "");
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
     this.lost = false;
     this.normalResponse = true;
     this.nextlevelOptions = false;
     this.plus = 0;
  }

  countPoints(){
    let pointObject = JSON.parse(localStorage.getItem('is_user_score') || "");
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
    localStorage.removeItem('is_user_score');
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
    localStorage.removeItem('is_user_score');
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
    this.play.playOnSuccessNext();
    this.nextlevel = true;
    this.normalResponse = false;

    //this.nextlevel = true;
    console.log(this.nextlevel)
    //this.play.playOnClick();
   // this.play.playOnSuccess();
   // this.play.playOnSuccessNext();


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
    //this.play.playOnSuccessNext();
    //this.nextlevel = true;
    //this.normalResponse = false;

    //this.nextlevel = true;
    //console.log(this.nextlevel)
    //this.play.playOnClick();
    //this.play.playOnSuccess();
    //this.play.playOnSuccessNext();


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

  choose(item, quiz){
  
    console.log("quiz", quiz);
    console.log("item", item);

    let data = {
      id : item.id,
      quiz : quiz.id,
      response : item.choose
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
           console.log("My array", JSON.parse(localStorage.getItem('is_user_score') || ""));

          }
          else{
            console.log("Je m ajoute")
            arr.push(data);
            localStorage.setItem('is_user_score', JSON.stringify(arr));
          }
      
    }
     // console.log("Modifié", localStorage.getItem('is_user_score'));
  }


  checkPoint(item, quiz){
    //var i = item.length;
    let lui = {
       trouver : false,
       index : ""
    }
    item.forEach((currentValue, index) => {
      if(currentValue.quiz === quiz) {
        //  this.myArray.splice(index, 1);
          lui = {
            trouver : true,
            index : index
        }
      }
    });
/*     while (i--) {
       if (item[i].quiz === quiz) {
            let lui = {
                trouver : true,
                index : i
            }
           return lui;
       }
    }*/

    return lui; 
//}
  }

  checkIfGooresponse(item){
    console.log("Ma question", item)
    let locqlQuiz = JSON.parse(localStorage.getItem('is_user_score') || "");
    console.log("Mes reponses", locqlQuiz)
    var i = locqlQuiz.length;
    while (i--) {
      if (locqlQuiz[i].id === item.id && locqlQuiz[i].response=="0") {
            console.log("Ma reponse ici 1", locqlQuiz[i])
            return true;
          
      }
   }
   return false;
  }

  checkIfGooquestion(item){
   // console.log("Ma question", item)
    let locqlQuiz = JSON.parse(localStorage.getItem('is_user_score') || "");
   // console.log("Mes reponses", locqlQuiz)
    var i = locqlQuiz.length;
    //return JSON.parse(localStorage.getItem('is_user_score') || "")
    while (i--) {
      if (locqlQuiz[i].quiz === item && locqlQuiz[i].response=="0") {
       // console.log("Ma question ici 1", locqlQuiz[i])
            return true;
      }
      else if (locqlQuiz[i].quiz === item && locqlQuiz[i].response=="1"){
        this.plus = this.plus+1;
        return true;
      }
   }
   return false;
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
