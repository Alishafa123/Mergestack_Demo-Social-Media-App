import {StateController, type StateObject } from 'jotai-controller';

export interface UserProfile extends StateObject {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  bio: string;
  profile_url: string;
  city: string;
  country: string;
}

const initialState: UserProfile = {
  id: '',
  first_name: '',
  last_name: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  bio: '',
  profile_url: '',
  city: '',
  country: '',
};




export class UserProfileController extends StateController<UserProfile> {
 constructor() {
    super('user', initialState);
  }

  setUserProfile(id:string, first_name:string, last_name:string, phone:string, date_of_birth:string, gender:string, bio:string, profile_url:string, city:string, country: string) {
    this.updateState({
      id,
      first_name,
      last_name,
      phone,
      date_of_birth,
      gender,
      bio,
      profile_url,
      city,
      country,
    });
  }

  
}

export const userProfileController = new UserProfileController();
