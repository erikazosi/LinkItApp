//ng g class ./model/user.model

export class User{
  $key:string;
  firstName: String;
  lastName:string;
  email: String;
  password: String;
  phone: String;
  city: {
    lati: Number,
    longi: Number
  };
  category: String;
  role:String;
  uid: String;
  photoUrl: String;
}
