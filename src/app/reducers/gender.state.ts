
import { Gender } from '../shared/model/gender';

export default class StateGender {
    
    genders: Array<Gender>;
    errorGender: Error;
  }
  
  export const initializeState = (): StateGender => {
    return { 
    genders: Array<Gender>(),
    errorGender: null
    };
  };
