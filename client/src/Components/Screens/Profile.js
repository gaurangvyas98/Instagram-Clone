import React, { useEffect, useState, useContext } from 'react';
import M from 'materialize-css';
import { UserContext } from '../../App';

const Profile=()=>{

    const [mypics, setPics] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const [image,setImage] = useState("")
    
    //for getting all the post
    useEffect(()=>{
        fetch("/mypost", {
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
          .then(result=>{
                // console.log(result)
                setPics(result.myposts)
           })
    },[]);

    //for updating profile image
    useEffect(()=>{
       if(image){
            const data = new FormData()
            //uploading image to cloudinary
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "gaurangvyas")

            //uploading profile pic to cloudinary
            fetch("https://api.cloudinary.com/v1_1/gaurangvyas/image/upload", {
                method: "post",
                body: data
            }).then(res=>res.json())
                .then(data=>{
                    // console.log(data)
                    //sending pic url to backend, so that pic will get updated on the backend
                        fetch("/updatepic", {
                            method: "put",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer "+localStorage.getItem("jwt")
                            },
                            body: JSON.stringify({
                                pic: data.url
                            })
                        }).then(res=>res.json())
                          .then(result=>{
                                // console.log(result);
                                //updating state, adding pic in the state
                                localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic}))    
                                dispatch({type: "UPDATEPIC", payload: result.pic })
                                //showing toast
                                M.toast({html: "updated profile pic successfully ",classes:"rounded #43a047 green darken-1"})
                                
                            })
                })
                .catch(err=> {
                    console.log(err)
                })
        }
    },[image])

    const updatePhoto = (file)=>{
        setImage(file)
    }

    return(
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{ margin:"18px 0px", borderBottom:"1px solid grey" }}>
                <div style={{ display:"flex", justifyContent:"space-around" }}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src={state?state.pic:"loading"}
                        />
                    
                    </div>
                    <div>
                        <h4>{state?state.name:"loading"}</h4>
                        <h5>{state?state.email:"loading"}</h5>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state?state.followers.length:"0"} followers</h6>
                            <h6>{state?state.following.length:"0"} following</h6>
                        </div>

                    </div>
                </div>
     
                <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>      
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                        )
                    })
                }

            
            </div>
        </div>
    );  
}

export default Profile;