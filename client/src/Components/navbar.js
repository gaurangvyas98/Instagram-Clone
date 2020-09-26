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
        //responsive hamburger icon when opened in mobile
        let sidenav = document.querySelector('.sidenav');
        M.Sidenav.init(sidenav, {});
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
        <div>
        <nav className="nav-wrapper white">
            <div className="container">
                <Link to= {state ? "/" : "/signin"}  className="brand-logo">Instagram</Link>
                <a href="" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>
        </nav>

        <ul className="sidenav center-align" id="mobile-demo" >
                {renderList()}
        </ul>
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

// style={{ padding: "0 10px", backgroundColor: "white"}}






  // <div class="navbar-fixed">
        // <nav>  
        //     <div className="nav-wrapper white ">
                // <Link to= {state ? "/" : "/signin"}  className="brand-logo left">Instagram</Link>
                // <a href="" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                // <ul id="nav-mobile" className="right hide-on-med-and-down">
                //     {renderList()}
            
                // </ul>
        //     </div>
        // </nav>

        // {/* SIDE BAR/MOBILE SIDE BAR RESPONSIVE LIST */}
        // <ul className="sidenav center-align" id="mobile-demo" >
        //         {renderList()}
        // </ul>
        // {/* Modal Structure  classname modal useRef is referring to in the useEffect*/}
        // <div id="modal1" className="modal" ref={searchModal}>
        //     <div className="modal-content">
        //         <input
        //             type="text"
        //             placeholder="Search users"
        //             value={userSearch}
        //             onChange={(e)=>fetchUserSearch(e.target.value)}
        //         />
        //         <ul className="collection">
        //             {userDetails.map(item=>{
        //                 return  <Link to={item._id !== state._id ? "/profile/"+item._id : '/profile'} onClick={()=>{
        //                             M.Modal.getInstance(searchModal.current).close()
        //                             setUserSearch('')
        //                         }}><li className="collection-item">{item.email}</li></Link>
        //             })} 
        //         </ul>
        //     </div>
        //     <div className="modal-footer">
        //     <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setUserSearch("")}}>Close</button>
        //     </div>
        // </div>
        // </div>