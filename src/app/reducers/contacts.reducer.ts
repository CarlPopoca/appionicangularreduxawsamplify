import { BeginGetContact, ErrorContact, SuccessGetContact,SuccesSaveContact } from '../actions/contacts.actions';
import { Action, createReducer, on  } from '@ngrx/store';
import StateContact, { initializeState} from './contacts.state';


const initialState = initializeState();

const reducer = createReducer(
  initialState,
  on(BeginGetContact, (state: StateContact,{id}) => {
    console.log(id);
    return ({ ...state, id: id });
  }),
 on(SuccessGetContact, (state: StateContact, { payload }) => {
    
    return { ...state, contacts: payload, errorContact: null, id:null };
  }),
  on(SuccesSaveContact, (state: StateContact, { payload }) => {

   return { ...state, contacts: payload, errorContact: null };
 }),
  on(ErrorContact, (state: StateContact, error: Error) => {
  
    return { ...state, errorContact: error };
  })
);

export function ContactsReducer(state: StateContact | undefined, action: Action): StateContact {
  return reducer(state, action);
}


