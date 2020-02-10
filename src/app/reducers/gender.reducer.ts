import { BeginGetGender, ErrorGender, SuccessGetGender } from '../actions/gender.actions';
import { Action, createReducer, on  } from '@ngrx/store';
import StateGender, { initializeState} from './gender.state';


const initialState = initializeState();

const reducer = createReducer(
  initialState,
on(BeginGetGender, state => state),
 on(SuccessGetGender, (state: StateGender, { payload }) => {
    console.log(payload);
    return { ...state, genders: payload, errorGender: null, id:null };
  }),
  on(ErrorGender, (state: StateGender, error: Error) => {
  
    return { ...state, errorGender: error };
  })
);

export function GenderReducer(state: StateGender | undefined, action: Action): StateGender {
  return reducer(state, action);
}
