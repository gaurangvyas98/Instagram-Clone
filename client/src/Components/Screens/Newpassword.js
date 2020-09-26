import React, {useState, useContext} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import M from 'materialize-css';

const NewPassword=()=>{
  const history = useHistory();

  const [password, setPassword] = useState("");

  const {token} = useParams()
  // console.log(token)

  const postData=()=>{
      fetch("/new-password",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            password,
            token
        })
    }).then(res=>res.json())
      .then(data=>{
        // console.log("user DATA: ",data)
        if(data.error){
            M.toast({html: data.message,classes:"rounded #c62828 red darken-3"})
        }
        else{
            M.toast({html: "Password Updated successfully",classes:"rounded #43a047 green darken-1"})
            history.push('/Signin')
        }
      })
      .catch(err=>{
        console.log(err)
      })
    }

    
    return(
        <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
           <input
            type="password"
            placeholder="Enter a new Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={postData}>Update New Password</button>
          <h5>
              <Link to="/signup">Don't have an account ?</Link>
          </h5>
  
      </div>
    </div>
    );  
}

export default NewPassword;