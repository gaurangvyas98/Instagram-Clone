import React, {useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App'

const Navbar=()=>{

    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();

    //this function will return profile, create post link in nav if user is logged in otherwise it will return login and signup link in the navbar
    const renderList=()=>{
        if(state){
            return(
                [
                    <li><Link to="/profile">Profile</Link></li>,
                    <li><Link to="/Create">Create Post</Link></li>,
                    <li><Link to="/myfollowingpost">My following posts</Link></li>,
                    <li>
                        <button className="btn waves-effect waves-light #d32f2f red darken-2" onClick={()=>{
                            localStorage.clear();
                            dispatch({ type: "CLEAR" })
                            history.push("/signin")
                        }}>
                            Logout
                        </button>
                    </li>
                ]
            )
        }
        else{
            return(
                [
                    <li><Link to="/signin">Login</Link></li>,
                    <li><Link to="/signup">SignUp</Link></li>
                ]
            )
        }
    }

    return(
        <div class="navbar-fixed">
        <nav> 
            <div className="nav-wrapper white">
                <Link to= {state ? "/" : "/signin"}  className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
            
                </ul>
            </div>
        </nav>
        </div>
    );
}

export default Navbar;