import React, {useContext, useEffect, useRef, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar=()=>{

    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    const [userSearch, setUserSearch] = useState(null)
    const [userDetails, setUserDetails] = useState([])
    const searchModal = useRef(null)
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    //this function will return profile, create post link in nav if user is logged in otherwise it will return login and signup link in the navbar
    const renderList=()=>{
        if(state){
            return(
                [
                    <li ><i data-target="modal1" className="large material-icons modal-trigger" style={{color: "black"}}>search</i></li>,
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

    const fetchUserSearch=(query)=>{
        setUserSearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              query
            })
          }).then(res=>res.json())
          .then(results=>{
            setUserDetails(results.user)
          })
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
                
        {/* Modal Structure  classname modal useRef is referring to in the useEffect*/}
        <div id="modal1" className="modal" ref={searchModal}>
            <div className="modal-content">
                <input
                    type="text"
                    placeholder="Search users"
                    value={userSearch}
                    onChange={(e)=>fetchUserSearch(e.target.value)}
                />
                <ul className="collection">
                    {userDetails.map(item=>{
                        return  <Link to={item._id !== state._id ? "/profile/"+item._id : '/profile'} onClick={()=>{
                                    M.Modal.getInstance(searchModal.current).close()
                                    setUserSearch('')
                                }}><li className="collection-item">{item.email}</li></Link>
                    })} 
                </ul>
            </div>
            <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setUserSearch("")}}>Close</button>
            </div>
        </div>
        </div>
    );
}

export default Navbar;

