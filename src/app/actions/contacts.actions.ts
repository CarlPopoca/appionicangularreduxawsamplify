
import { } from '../shared/utils/constants';
import {  createAction, props } from '@ngrx/store';
import {ContactItem}  from '../shared/model/contactItem';

export enum ContactActionTypes {
    BeginGetContact = '[ContactItem] Begin Get Contact',
    SuccessGetContact = '[ContactItem] Success Get Contact' ,
    BeginSaveContact = '[ContactItem] Save Contact',
    SuccessSaveContact = '[ContactItem] Success Save Contact',
    ErrorContact = '[ContactItem] Error Contact'
  }
    
    //Una acción para obtener los datos
  export const BeginGetContact = createAction(ContactActionTypes.BeginGetContact,
    props<{id:any}>()
  );
    
        //Otra acción para devolver los datos
  export const SuccessGetContact = createAction(
    ContactActionTypes.SuccessGetContact,
    props<{ payload: ContactItem }>()
  );

  export const ErrorContact = createAction(
    ContactActionTypes.ErrorContact, 
   props<Error>()
   );

     //Una acción para guardar el registro
  export const BeginSaveContact = createAction(
      ContactActionTypes.BeginSaveContact,
      props<{payload: ContactItem}>()
  );
  //Una acción para  la confirmación de guardado 
  export const SuccesSaveContact = createAction(
    ContactActionTypes.SuccessSaveContact,
    props<{payload: ContactItem}>()
  );
   