import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: [],
})
export class ContactPage implements OnInit {

  constructor(public alertController: AlertController) { 
  
  }

  ngOnInit() {
    
  }

}
