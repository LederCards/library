import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private toastController: ToastController) { }

  async showMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }
}
