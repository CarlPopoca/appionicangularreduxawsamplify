import { Component, OnInit } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';
import { AmplifyService } from 'aws-amplify-angular';
 import { ContactsItemModalPage } from '../contacts-item-modal/contacts-item-modal.page';
import { ContactItem } from '../../../shared/model/contactItem';
import {Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import StateContact from '../../../reducers/contacts.state';
import StateGender from '../../../reducers/gender.state';
import * as ContactsActions from '../../../actions/contacts.actions';
import { AlertController } from '@ionic/angular';
import { v4 as uuid } from 'uuid';
import { Gender } from '../../../shared/model/gender';
import * as  GenderActions  from '../../../actions/gender.actions';
import {Items} from '../../../shared/model/items';
import * as Messages from '../../../shared/utils/constants';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.page.html',
  styleUrls: [],
})
export class ContactsListPage implements OnInit {

  amplifyService: AmplifyService;
  modal: any;
  data: any;
  user: any;
  signedIn: boolean;

  //Contactos
  itemList: ContactItem|any;
  contactError: Error = null;
  contactSubscription: Subscription;
  contact$: Observable<StateContact>;
  //Genero
  genderList: Gender[]=[];
  genderError: Error = null;
  genderSubscription:Subscription;
  gender$: Observable<StateGender>;

 //Se pasa por inyección de dependencía:
 //ModalController: Para poder hacer que una vista se interponga
 //AmplifyService: Para obtener información de un usuario, nos ayudara tambíen a saber si hay esta logeado
  constructor(
    public modalController: ModalController,
    amplify: AmplifyService,
    events: Events,
    private store: Store<{contacts: StateContact, gender: StateGender}>,
    public alertController: AlertController
  ) {
    this.amplifyService = amplify;
    this.contact$ = store.pipe(select('contacts'));
    this.gender$ = store.pipe(select('gender'));
    //Se obtienen los datos del AuthState para ver si hay un usuario logeado para obtener su infrmación
    // y luego mostrar la lista de contactos
    events.subscribe('data:AuthState', async (data) => {
      //Si hay datos en la variable user se obtienen lso datos y luego la lista de contactos
      if (data.user){
        this.user = await this.amplifyService.auth().currentUserInfo();
      }
    })
   
  }

  async ngOnInit(){
    var message:string;
    //Se obtienen los datos del usuario actualmente logeado
    this.user = await this.amplifyService.auth().currentUserInfo();
    if (this.user){
      //Se obtiene la lista de contactos
      this.contactSubscription = this.contact$
      .pipe(
        map(x => {
          this.itemList = x.contacts;
          this.contactError = x.errorContact;
        })
      )
      .subscribe();
      //Se obtiene los generos
      this.genderSubscription = this.gender$
      .pipe(
        map(x=> {
          this.genderList = x.genders,
          this.genderError = x.errorGender
        })
      ).subscribe();
      
      this.store.dispatch(ContactsActions.BeginGetContact({id: this.user.id}));
      this.store.dispatch(GenderActions.BeginGetGender());

      if (this.contactError)
      {
        message.concat(Messages.MESSAGE_ERROR, this.contactError.message)
        this.displayErrorAlert(message);
      }

      if (this.genderError)
      {
        message.concat(Messages.MESSAGE_ERROR, this.genderError.message)
        this.displayErrorAlert(message);
      }
    }
    else
    {
      this.displayErrorAlert(Messages.MESSAGE_NO_ACTIVE_USER);
    }

  }

  async deleteConfirm(i) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Perform the transaction.?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.delete(i)
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }


  async displayErrorAlert(error:string)
  {

    const alert = await this.alertController.create({
      header: 'Error',
      message: error,
      cssClass: 'alert-danger',
      buttons: [
      {
        text: "Ok",
        handler: data => {
          console.log("Ok Clicked")
        }
      }]
    });
    await alert.present();

  }

  async modify(item, i) {
    //Se llena el props con la variable itemsList o la instancia de la clase ConstactList cuyo constructor
    //espera recibir conuna variable generica el userId y/o los items
    console.log(this.genderList);
      var itemContact:ContactItem;
      if (this.itemList)
      {
        itemContact = this.itemList;
      }else
      {
        itemContact = new ContactItem();
        itemContact.userId = this.user.id;
        itemContact.items = new Array<Items>();
      }

    let props = {

      itemList: itemContact,
      genderList: this.genderList,
      //Asigna los valores a la variable editItem o asigna undefined
      editItem: item || undefined
    };

    //Crea el modal con el ContactsItemModalPage y pasa a su props lo que asignamos a la variable props
    const modal = await this.modalController.create({
      component: ContactsItemModalPage,
      componentProps: props
    });
    //Escucha si el modal ya fue cerrado para ejecutar las acciones de crear un registro o guardar los cambios 
    // a un registro
    modal.onDidDismiss()
    .then((result) => {
      //Si la promesa se cumplio se valida si se realizo una alta o modificación en el modal
      if (result.data.newItem){
        //Si se fue uan alta se agrega al array con el método push
        result.data.newItem.id = uuid();

        console.log(result.data.itemList.items);
        result.data.itemList.items.push(result.data.newItem)

      } else if (result.data.editItem){
        //Si es modificación de acuerdo al index pasado como parametro con i se reemplazan
        // los datos del contacto
        result.data.itemList.items[i] = result.data.editItem
      }
      //Se pasa al método save la variable itemList para que se realice la transacción
      this.save(result.data.itemList);
    });
    return await modal.present();
  }

  delete(i){
    var contact:ContactItem;
    contact = this.itemList;
    contact.items.splice(i, 1);
    this.save(contact);
  }
  
  save(list){
    this.store.dispatch(ContactsActions.BeginSaveContact({payload: list}));
    if (this.contactError)
    {
      var message:string;
      message.concat(Messages.MESSAGE_ERROR, this.contactError.message);
      this.displayErrorAlert(message);
    }
  }

  ngOnDestroy() {
    if (this.contactSubscription) {
      this.contactSubscription.unsubscribe();
    }

    if (this.genderSubscription)
    {
      this.genderSubscription.unsubscribe();
    }
  }

}
