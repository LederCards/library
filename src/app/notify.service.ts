import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private toastController = inject(ToastController);

  async showMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }
}
