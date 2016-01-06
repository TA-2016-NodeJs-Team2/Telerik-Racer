# Telerik-Racer
### Models
* User
  * username {`String`}
  * password {`String`}
  * role {`String`}
  * cars {`[Object]`}
  * money {`Number`} _without float numbers_
  * rank {`Number`}
  * dateRegistered {`Date`}
  * respect {`Number`}
  * level {`Number`} _Depends on respect_
  * token {`String`} _generate on login_
  * lastLogindate {`Date`}
  * busyUnit {`Date`} _DateTime().now + busyHours_
  
* Race
  * dateCreated {`Date`}
  * users {`[Object]`} / {`[String]`} (_UserNamesOnly_)
  * status {`String`}
  * map {`String`} / {`Object`}
  
* Car
  * price {`Number`}
  * model {`String`}
  * wheelsLevel {`Number`}
  * engineLevel {`Number`}
  * turbo {`Number`} [0-100]
  * urlImage {`String`}
  * dateCreated {`Data`}
  * levelRequired {`Number`}
  * damage {`Number`} _car status. 100 - broken_
  
* Map
  * name {`String`}
  * prices {`[Number]`} _money which users will earn after race is finished_
  * respectGiven {`[Number]`} _Same as prices, and user can gain levels_
  * damageToTake {`Number`} _Damage to take from each_
  
* Job
  * name {`String`}
  * money {`Number`}
  * busyHours {`Number`} _user will earn `money` after that hours. User cannot participate in race while working_
        
### Server routes
* api/users/
  * register (public)
  * login (public)
  * delete (private) ~administrator role required
  * all
* api/races/
  * all
  * create (private)
* api/cars/
  * all
        
    TODO: More work here
### Client routes
    TODO: More work here
