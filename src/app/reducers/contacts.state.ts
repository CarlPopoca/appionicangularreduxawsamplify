
import { ContactItem } from '../shared/model/contactItem';

export default class StateContact {
    
    contacts: ContactItem;
    errorContact: Error;
    id: string;
    indexContact: number;
  }
  
  export const initializeState = (): StateContact => {
    return { 
    contacts: new ContactItem(),
    errorContact: null,
    id: null,
    indexContact: null
    };
  };
