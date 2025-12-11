import { StateController, type StateObject } from 'jotai-controller';

export interface User extends StateObject {
  id: string;
  email: string;
  name: string;
}

const initialState: User = {
  id: '',
  name: '',
  email: ''
};




export class UserController extends StateController<User> {
 constructor() {
    super('user', initialState);
    
  }

  login(id:string ,name: string, email: string) {
    debugger
    this.updateState({
      id,
      name,
      email,
    });
  }

  logout() {
    this.updateState(initialState);
  }
}

export const userController = new UserController();
