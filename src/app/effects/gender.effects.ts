import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GenderActions from '../actions/gender.actions';
import { Observable, of, from } from 'rxjs';
import {  catchError, map, mergeMap,switchMap } from 'rxjs/operators';
import {Gender} from '../shared/model/gender';
import {GenderService} from '../services/gender.service';

@Injectable()
export class GenderEffects {

  constructor(private gendersService: GenderService, private action$: Actions) {

  }
  //mergeMap se ocupa cuando se consume API con http Service, switchMap se ocupa para API AWS que devuelven un Array
  //from convierte el resultado del servicio a Observable 
  GetGender$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(GenderActions.BeginGetGender),
    switchMap(action =>
      from(this.gendersService.getGender(), ).pipe(
        map((data: Gender[]) => {
         return GenderActions.SuccessGetGender({ payload: data });
        }),
        catchError((error: Error) => {
          return of(GenderActions.ErrorGender(error));
        })
      )
    )
  )
);
    
}