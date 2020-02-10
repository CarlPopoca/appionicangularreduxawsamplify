import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ContactActions from '../Actions/contacts.actions';
import { Observable, of, from } from 'rxjs';
import {  catchError, map, mergeMap,switchMap } from 'rxjs/operators';
import {ContactItem} from '../shared/model/contactItem';
import {ContactsService} from '../services/contacts.service';

@Injectable()
export class ContactsEffects {

  constructor(private contactsService: ContactsService, private action$: Actions) {

  }
  //mergeMap se ocupa cuando se consume API con http Service, switchMap se ocupa para API AWS que devuelven un Array
  //from convierte el resultado del servicio a Observable 

GetContact$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(ContactActions.BeginGetContact),
    switchMap(action =>
      from(this.contactsService.getContacts(action.id), ).pipe(
        map((data: ContactItem) => {
          console.log(data);
         return ContactActions.SuccessGetContact({ payload: data });
        }),
        catchError((error: Error) => {
          return of(ContactActions.ErrorContact(error));
        })
      )
    )
  )
);

SaveContact$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(ContactActions.BeginSaveContact),
    switchMap(action =>
      from(this.contactsService.saveContacts(action.payload), ).pipe(
        map(() => {
         return ContactActions.SuccesSaveContact({ payload: action.payload});
        }),
        catchError((error: Error) => {
          return of(ContactActions.ErrorContact(error));
        })
      )
    )
  )
);

}