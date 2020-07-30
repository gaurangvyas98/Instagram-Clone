import React, { useState, useEffect } from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Signup=()=>{
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    //this useEffect will only work when the image is uploaded and we have url
    useEffect(()=>{
      if(url){
        uploadFieldsData()
      }
    },[url])


    const uploadPic=()=>{
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

    const uploadFieldsData=()=>{
      // validating email 
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "invalid email",classes:"rounded #c62828 red darken-3"})
        return
      }

      fetch("/signup",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name,
            password,
            email,
            pic: url
        })
    }).then(console.log("State : ", name, password, email))
      .then(res=>res.json())
      .then(data=>{
        if(data.error){
            M.toast({html: data.error,classes:"rounded #c62828 red darken-3"})
        }
        else{
            M.toast({html:data.message,classes:"rounded #43a047 green darken-1"})
            history.push('/signin')
        }
      })
      .catch(err=>{
        console.log(err)
      })
    }

    //if user has not uploaded image we will only upload other fields(name, email, pass)
    //else we will upload image with all the other fields
    const postData=()=>{
      if(image){
        uploadPic()
      }
      else{
        uploadFieldsData()
      }
    }

    return(
        <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

           <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1 btn-small">
                    <span>Select Pic</span>
                    <input type="file" onChange={ (e)=>setImage(e.target.files[0]) }/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={postData} >Sign Up</button>
          <h5>
              <Link to="/signin">Already have an account ?</Link>
          </h5>
          <h6>
              <Link to="/reset">Forgot password ?</Link>
          </h6>
  
      </div>
    </div>
    );  
}

export default Signup;