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
  * prizes {`[Number]`} _money which users will earn after race is finished_
  * respectGiven {`[Number]`} _Same as prizes, and user can gain levels_
  * damageToTake {`Number`} _Damage to take from each_
  
* Job
  * name {`String`}
  * money {`Number`}
  * busyHours {`Number`} _user will earn `money` after that hours. User cannot participate in race while working_
        
### Routes
* / - home page (public) with nav bar, footer
* __api/users/__
    * `GET` __/register__  displays a register form (public)
    * `GET` __/login__ displays a login form (public)
    * `POST` __/register__ (public)
    * `POST` __/login__ (public)
* __api/admin/__  (only for administrator)
    * `GET` __/users?page=1&size=10&sort=asc&by=username__ - lists all users (default values if no query params provided)
        * Should have links to user's details. May use Kedno Grid
    * `GET` __/users/:id__ - details about user
        * Should have buttons for delete and Update (role, money, username) 
    * `DELETE` __/users/:id__ - delete user from db
    * `PUT` __/users/:id__ - update user properties (role, money, username)
* __races/__
    * `GET` __/all?page=1&size10&sort=desc&by=date__ - (public) lists latest races 
        * Should have links to races's details. May use Kedno Grid
    * `GET` __/add__ (private registered users only) shows a form for create a race. User can choice a _map_ only by name (dropdown)
    the user should provide a car (from his bought cars)
    * `POST` __/add__ (private) creates a new race 
    * `GET` __/:id__ (private) details about race, status, (ranking if finished)
    * `PUT` __/:id__ (private) user provides a car and joins into race. Car should not have damage 100%
    * `POST` __/:id/start__ (private) some logic when the race will start (the user creator of the race can starts)
        * game logic should give rewards on users
* __shop/cars/__
    * `GET` __/all?page=1&size10&sort=desc&by=model__ - (private) cars
        * Should have links to cars's details. May use Kedno Grid
    * `GET` __/:id__ (private) car details, money, engine level etc.
        * if user does'n have this car in collection, should have option to buy it
    * `POST` __/:id/buy__ (private) if user have enough money, car is added to collection
    * `GET` __/add__ (moderator and administrators only) form for creating a car
    * `POST` __/add__ (moderator and administrators only) - _if time is enough will be implemented_
    * `DELETE` __/:id/remove__ (administrators only) - _if time is enough will be implemented_
* __maps/__ (moderators and administrators)
    * `GET` __/all?page=1&size10&sort=desc&by=name__ - lists maps
        * Should have links to maps's details. May use Kedno Grid
    * `GET` __/:id__  damage to take from cars, and prizes.
    * `GET` __/add__  form for creating a map
    * `POST` __/add__  adds a map
    * `DELETE` __/:id/remove__ (administrator only) _if time is enough will be implemented_
* __profile/__ (private)
    * `GET` __/__ user info 
    * `GET` __/cars__ user cars
    * `GET` __/cars/:model__ car details where user should have an option to repair the car, if any damage is taken
    * `PUT` __/cars/:model/repair__ if user has enough money.
* __jobs/__ (private) _if time is enough will be implemented_
    * `GET` __/all__ some jobs with buttons. Then clicked start working to earn money after `N` hours  
    * `PUT` __/:id/__ user cannot get another work, or race until this job is finished


### Game logic
    User can buy a car. User makes a race with one of his cars. Other users can join while provide a car to race with. 
    The race can be started when there are more than one user. After race, first five users receive a respect and money
    depends on map. For each car in the race deal a damage depends on map. When respect is enough user can gain a level
    and new cars are unlocked in shop. Users should repair cars.