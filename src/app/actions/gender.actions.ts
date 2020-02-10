

import {  createAction, props } from '@ngrx/store';
import {Gender}  from '../shared/model/gender';

export enum GenderActionTypes {
    BeginGetGender= '[Gender] Begin Get Gender',
    SuccessGetGender = '[Gender] Success Get Contact ' ,
    ErrorGender = '[Gender] Error Gender'
  }
    
//Una acción para obtener los datos
export const BeginGetGender = createAction(GenderActionTypes.BeginGetGender);

    //Otra acción para devolver los datos
export const SuccessGetGender = createAction(
    GenderActionTypes.SuccessGetGender,
props<{ payload: Gender[] }>()
);


export const ErrorGender = createAction(
    GenderActionTypes.ErrorGender, 
   props<Error>()
   );
