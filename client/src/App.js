import React, {useEffect, createContext, useReducer, useContext} from 'react';
import './App.css';
import {BrowserRouter, Route, useHistory, Switch} from 'react-router-dom';
import Navbar from './Components/navbar';
import Home from './Components/Screens/Home';
import Profile from './Components/Screens/Profile';
import Signin from './Components/Screens/Signin';
import Signup from './Components/Screens/Signup';
import CreatePost from './Components/Screens/CreatePost';
import UserProfile from './Components/Screens/UserProfile';
import SubscribedUsersPost from './Components/Screens/subscribedUsersPost';
import ResetPassword from './Components/Screens/Reset';
import NewPassword from './Components/Screens/Newpassword';

import {initialState, reducer} from './Reducer/userReducer';

export const UserContext = createContext();

//we can't access history in browserrouter component
//useReducer is similar to useState, we use it with context
const Routing = () =>{
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));//it is present as string so we have to parse it to json object
    // console.log(typeof(user), user);

    //if the user is logged in, redirect user to home screen else redirect user to signin screen
    if(user){
      dispatch({ type: "USER", payload: user})
      // history.push("/");
    }
    else{
      //if pathname is not reset password
      if(!history.location.pathname.startsWith("/reset"))
        history.push("/signin")
    }
  },[])
  
  return(
    //switch make sure that any one route is active, completely optional
    <Switch> 
      <Route exact path="/"> 
        <Home /> 
      </Route>
      <Route path="/Signin"> 
        <Signin /> 
      </Route>
      <Route exact path="/Profile"> 
          <Profile /> 
      </Route>
      <Route path="/Signup"> 
        <Signup /> 
      </Route>
      <Route path="/Create"> 
        <CreatePost /> 
      </Route>
      <Route path="/profile/:userid"> 
        <UserProfile /> 
      </Route>
      <Route path="/myfollowingpost"> 
        <SubscribedUsersPost /> 
      </Route>
      <Route exact path="/reset"> 
        <ResetPassword /> 
      </Route>
      <Route path="/reset/:token"> 
        <NewPassword /> 
      </Route>
    </Switch>
  )
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
   </UserContext.Provider>
  );
}

export default App;
