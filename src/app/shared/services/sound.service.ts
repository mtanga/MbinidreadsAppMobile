import { Injectable } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from "@angular/platform-browser";
@Injectable({
  providedIn: 'root'
})
export class SoundService {

  urlSafe: SafeResourceUrl;

  constructor(
    protected sanitizer: DomSanitizer,
  ) { }


  playOnClick() {
    var audio = new Audio('../../../../assets/sounds/click.mp3');
    audio.play();
  }


  playOnHover() {
    var audio = new Audio('../../../../assets/sounds/hoverBook.mp3');
    audio.play();
  }

  playOnSuccess() {
    var audio = new Audio('../../../../assets/sounds/success.mp3');
    audio.play();
  }

  playOnSuccessNext() {
    var audio = new Audio('../../../../assets/sounds/great_job.mp3');
    audio.play();
  }

  playOnLowScore() {
    var audio = new Audio('../../../../assets/sounds/lowscore.mp3');
    audio.play();
  }

  listen(song:any) {
    let urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(song.replace(/\s/g, ''));
    var audio = new Audio(song);
    audio.play();
  }

  playOnLowScoreMoyen() {
    var audio = new Audio('assets/sounds/scoremoyen.mp3');
    audio.play();
  }

}
