import React, { useState, useEffect } from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

const CreatePost=()=>{
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    //useEffect will run only when the state of variable "url" is changed, we have added url as the dependancy array, so it means useEffect will only run when the image is uploaded on cloudnary and state of "url" is changed to something
    //but it will run automatically run when the component mounts means site loads so we need an if condition
    useEffect(()=>{
        //uploading image to backend
        if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic: url,

            })
             }) //.then(console.log("State : ", title, body, url))
               .then(res=>res.json())
               .then(data=>{
                    // console.log("user DATA: ",data)
                    if(data.error){
                        M.toast({html: data.error,classes:"rounded #c62828 red darken-3"})
                    }
                    else{
                        M.toast({html: "Created Post successfully",classes:"rounded #43a047 green darken-1"})
                        history.push('/')
                    }
                })
                .catch(err=>{
                    console.log(err)
            })
        }
    },[url])

    const postDetails=()=>{
        const data = new FormData()
        //uploading image to cloudinary
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "gaurangvyas")

        fetch("https://api.cloudinary.com/v1_1/gaurangvyas/image/upload", {
            method: "post",
            body: data
        }).then(res=>res.json())
          .then(data=>{
              setUrl(data.url)
          })
          .catch(err=> {
              console.log(err)
           })
    }

    return(
        <div className="card input-field" style={{
            margin:"40px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input 
                type="text" 
                placeholder="Title"
                value={title}
                onChange={(e)=> setTitle(e.target.value) }
            />
            
            <input 
                type="text" 
                placeholder="Body"
                value={body}
                onChange={(e)=> setBody(e.target.value) }
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1 btn-small">
                    <span>Select Image</span>
                    <input type="file" onChange={ (e)=>setImage(e.target.files[0]) }/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={postDetails}>
                Upload Post <i class="material-icons right">file_upload</i>
            </button>
        </div>
    );  
}

export default CreatePost;