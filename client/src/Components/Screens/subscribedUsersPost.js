import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App';
import {Link} from 'react-router-dom';

const SubscribedUsersPost=()=>{

    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);

    //to get all the post
    useEffect(()=>{
        fetch("/getsubscribeduserspost" , {
            headers : {
                "Authorization": "Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res=>res.json())
          .then(result=>{
               console.log(result.posts)
              setData(result.posts);
          })
    },[])

    //to post likes
    const likePost=(id)=>{
        fetch("/like", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt") 
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
            .then(result=>{
                //updating the data state
                const newData = data.map(item=>{
                    if(item._id === result._id){
                        return result
                    }
                    else{
                        return item
                    }
                })
                setData(newData)
            
            })
    }

    //to post unlikes
    const unLikePost=(id)=>{
        fetch("/unlike", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt") 
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
            .then(result=>{
                // console.log(result)
                const newData = data.map(item=>{
                    if(item._id === result._id){
                        return result
                    }
                    else{
                        return item
                    }
                })
                setData(newData)
            })
        }

    // to post addComment
    const addComment=(text, postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
           })
          setData(newData)

        }).catch(err=>{
            console.log(err)
        })
    }

    //to delete post
    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return(
       <div className="home">

            {data.map(item=>{
                return(
                    <div className="card home-card" key={item._id}>
                        <h5><Link to={"/profile/"+item.postedBy._id}>{item.postedBy.name}  </Link>
                        {
                            item.postedBy._id === state._id 
                            &&
                            <i className="material-icons" style={{float: "right"}} onClick={()=>deletePost(item._id)}>delete</i>
                        }</h5>

                        <div className="card-image">
                        <img 
                            src={item.photo}/>
                        </div>
                        <div className="card-content">

                            {item.likes.includes(state._id)
                                ?
                                <i className=" material-icons" onClick={()=>{
                                    unLikePost(item._id)}}>
                                    thumb_down
                                </i>
                                :                             
                                <i className=" material-icons" onClick={()=>{
                                    likePost(item._id)
                                    }}>
                                    thumb_up
                                </i>                 
                            }

                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {/* ----COMMENTS----- */}
                            { 
                                item.comments.map((record)=>{
                                return <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}: </span>{record.text}</h6>
                            })}

                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                // console.log(e.target[0].value)
                                addComment(e.target[0].value, item._id) //comment text, postId
                            }}>
                                <input type="text" placeholder="add a comment"></input>
                            </form>
                            
                        </div>
                    </div>
                )
            })}
       </div>
    );  
}

export default SubscribedUsersPost;



// "https://images.unsplash.com/photo-1569007889977-42e2392850d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=801&q=80"






