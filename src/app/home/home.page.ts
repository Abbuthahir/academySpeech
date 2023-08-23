import { ChangeDetectorRef, Component } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  myText = 'Today is a good day to learn Ionic';
  recording = false;
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.requestPermissions();
  }

  async startRecognition() {
    const { available } = await SpeechRecognition.available();

    if (available) {
      this.recording = true;
      SpeechRecognition.start({
        popup: false,
        partialResults: true,
        language: 'en-US'
      });
      SpeechRecognition.addListener('partialResults', (data: any) => {
        console.log('partialResults was fired', data.matches);
        if (data.matches && data.matches.length > 0) {
          this.myText = data.matches[0];
          this.changeDetectorRef.detectChanges();
        }
        if (data.value && data.value.length > 0) {
          this.myText = data.value[0];
          this.changeDetectorRef.detectChanges();
        }
      })
    }
  }

  async stopRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();
  }


  async speakText() {
    if (this.myText.trim() !== '') {
      TextToSpeech.speak({
        text: this.myText,
      });
    }
  }
}
