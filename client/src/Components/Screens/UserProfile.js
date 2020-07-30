import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import {useParams} from 'react-router-dom';

const UserProfile=()=>{

    const [userProfile, setUserProfile] = useState(null);
    const {state, dispatch} = useContext(UserContext);
    const {userid} = useParams();

    const [showFollowButton, setShowFollowButton] = useState(state? !state.followers.includes(userid): true)
    // console.log(userid)
    
    useEffect(()=>{
        fetch(`/user/${userid}`, {
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
          .then(result=>{
                console.log(result)
                setUserProfile(result)
           })
    },[]);

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid //we are getting userId from the params
            })
        }).then(res=>res.json())
        .then(data=>{
        
            console.log(data)
            //updating state, adding follwers and follwing in the state
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             //updating setProfile state
             setUserProfile((prevState)=>{
                
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers: [...prevState.user.followers,data._id]
                        }
                 }
             })
              setShowFollowButton(false)
        })
    }

    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid //we are getting userId from the params
            })
        }).then(res=>res.json())
        .then(data=>{
        
            console.log(data)
            //updating state, adding follwers and follwing in the state
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             //updating setProfile state
             setUserProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers: newFollower
                        }
                 }
             })
             setShowFollowButton(true) 
        })
    }


    return(
        <>
            {userProfile ? 
                <div style={{maxWidth:"550px",margin:"0px auto"}}>
                    <div style={{margin:"18px 0px", borderBottom:"1px solid grey"}}>

                        <div style={{display:"flex", justifyContent:"space-around" }}>
                            <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                            src={userProfile.user.pic}
                            />
                        
                            <div>
                                <h5>{userProfile.user.name}</h5>
                                <h6>{userProfile.user.email}</h6>
                                <div style={{display:"flex", justifyContent:"space-around", width:"108%"}}>
                                    <h6>{userProfile.posts.length} posts</h6>
                                    <h6>{userProfile.user.followers.length} followers</h6>
                                    <h6>{userProfile.user.following.length} following</h6>
                                </div>
                                {/* if already followed user show unfollow button otherwise show follow button */}
                                {showFollowButton ? 
                                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>followUser()}>Follow</button>
                                    :
                                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>unfollowUser()}>Unfollow</button>
                                }
                                
                              
                            </div>
                        </div>
                    </div>
                    <div className="gallery">
                        {userProfile.posts.map(item=>{
                            return(
                                <img key={item._id} className="item" src={item.photo} alt={item.title} />
                            )
                        })}
                
                </div>
                </div>
            
            : 
            <h1>Loading.....</h1>
            } 
        </>

       
    );  
}

export default UserProfile;