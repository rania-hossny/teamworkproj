import React, { useState,useEffect } from 'react'
import { Col, Card, Nav, Row, Button, Modal } from 'react-bootstrap';
import { BiImageAdd } from "react-icons/bi";
import photo from "./pietra-schwarzler-FqdfVIdgR98-unsplash.jpg";
import { ImReply } from "react-icons/im";
import { BiDotsVerticalRounded } from "react-icons/bi";
import styles from "./teamcontent.module.css"
import { RiSendPlaneFill } from "react-icons/ri";
import addpostimg from "./undraw_add_post_64nu.png"
import {format} from "timeago.js"



const Posts = (props) => {
  // let local=JSON.parse(localStorage.getItem("user-info"))
  // const urluser = local.user.url;
  //modal edit post
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //modal edit comment
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [postBody, setPostBody] = useState("");
  const [idshow, setIdshow] = useState(""); //post id
  const [idPCshow, setIdPCshow] = useState(""); //post id
  const [idCshow, setIdCshow] = useState(""); //comment id
  const [commentBody, setCommentBody] = useState("");
  const [commentBodyM, setCommentBodyM] = useState("");
  const [data,setData]=useState([])
  console.warn(props.id) //team id
  // let user=JSON.parse(localStorage.getItem("user-info"))
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id"); //user id
  const [url, setUrl] = useState("");

  useEffect(() => {
    getUsers();
    getPosts();
  },[commentBody])

  function getUsers() {
    fetch("https://boiling-shelf-43809.herokuapp.com/user/"+id+"/profile"
    , {
      headers:{
        "authorization":`${token}`
      }
    }
    ).then((result) => {
      result.json().then((resp) => {
        // console.warn(resp)
        // console.warn(resp.profile)
        setUrl(resp.profile.url)
      })
    })
  }

  //all posts
  async function getPosts(){
    await fetch(`https://boiling-shelf-43809.herokuapp.com/post/${props.id}/allPosts`,{
      headers:{
        "authorization":`${token}`
      }
    }).then(resp=>resp.json())
    .then(result=>{
      setData(result.post)
      // console.log(data)
      // console.log(result)
      console.log(result.post)
    })
  }
  
  // add post
  const createpost=(postBody)=>{
    let item={postBody}
    console.warn("item",item)
    fetch(`https://boiling-shelf-43809.herokuapp.com/post/${props.id}/addPost`,
    {
        method:"POST",
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          "authorization":`${token}`
        },
        body:JSON.stringify(item)
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        getPosts();
        setPostBody("")
    })
   }

  //  add comment
  const makeComment=(commentBody,postId)=>{
    let item={commentBody}
  console.warn("item",item)
    fetch(`https://boiling-shelf-43809.herokuapp.com/post/${postId}/addReply`,{
      method:"POST",
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        "authorization":`${token}`
      },
      body:JSON.stringify(item)
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      const newData = data.map(item=>{
        // compare id for same post
        if(item._id==result._id){
          return result
        }else{
          return item
        }
      })
      setData(newData)
      getPosts();
      setCommentBody("")

    }).catch(err=>console.log(err))
  }

  // delete post
  const deletePost=(postId)=>{
    fetch(`https://boiling-shelf-43809.herokuapp.com/post/${postId}/deletePost`,{
    method:"delete",
    headers:{
        "authorization":`${token}`
      },
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      const newData = data.filter(item=>{
        return item._id !==postId
      })
      setData(newData)
      getPosts();
    }).catch(err=>console.log(err))
  }

  // delete comment
  const deleteComment=(comId,posId)=>{
    console.log(comId)
    console.log(posId)
    fetch(`https://boiling-shelf-43809.herokuapp.com/post/${posId}/${comId}/deleteReply`,
      {
        method:"delete",
        headers:{
        "authorization":`${token}`
      },
      }
    ).then(res=>res.json())
    .then(result=>{
      console.log(result)
      const newData = data.filter(item=>{
        return item.comments._id !==comId
      })
      setData(newData)
      getPosts();
    }).catch(err=>console.log(err))
  }

  // shiowing edit post model
  const showing=(postId,postbody)=>{
    handleShow()
    setIdshow(postId)
    setPostBody(postbody)
    console.log(idshow)
  }

   // shiowing edit comment model
  const showingComModel=(postId,comId,commentbody)=>{
    handleShow2();
    setIdPCshow(postId)
    setIdCshow(comId)
    setCommentBody(commentbody)
    // console.log(idPCshow)
    // console.log(idCshow)
  }

  // edit comment
  const handleEditComment=()=>{
    let postID=idPCshow
    let commentID=idCshow
    console.log(postID)
    console.log(commentID)
    let item ={commentBody:commentBodyM}
    console.log("item",item)
    fetch(`https://boiling-shelf-43809.herokuapp.com/post/${postID}/${commentID}/editReply`,
    {
        method:"PUT",
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          "authorization":`${token}`
        },
        body:JSON.stringify(item)
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)   
        handleClose2();
        getPosts();
    })

  }

  // edit post
  const handleEditPost=()=>{
    let postID=idshow
    console.log(postID)
      let item ={postBody}
      console.log(item)

      fetch(`https://boiling-shelf-43809.herokuapp.com/post/${postID}/editPost`,
    {
        method:"PUT",
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          "authorization":`${token}`
        },
        body:JSON.stringify(item)
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
       
        handleClose();
        getPosts();
    })
  }
    return (
      <>
      {/* add post section */}
       <div className={styles.addpostsection}>
          <form onSubmit={(e)=>{
            e.preventDefault()
            console.log(postBody)
            createpost(postBody) }} 
            >

              <textarea rows="1"  placeholder="Say something..." className="form-control" 
              onChange={(e)=>{setPostBody(e.target.value)}}
              // value={postBody}
              />

              <button type="submit" className="btn btn-primary" style={{float:"right"}}><RiSendPlaneFill className={styles.iconsendpost}/></button>
            </form>
              <div className={styles.imginputpost}>
                  <img src={url} style={{margin:"0px",objectFit:"fill"}}/>
              </div>
      </div>

                    <Row className={styles.userActivities}>  
                    {
                      data.length == 0 ? <>
                      <div>
                        <img src={addpostimg} style={{width:"650px",marginLeft: "154px",paddingLeft: "60px"}}/>
                        <p style={{textAlign:" center",fontSize: "30px",color: "#a0a0a0"}}>No Posts Yet</p>
                      </div>
                      </> : data.map(item=>{
            return(
              <div className={styles.i} key={item._id}>
                <a className={styles.photopost} >
                  <img src={item.ownerImage} style={{margin:"0px"}}></img>
                </a>
               <div className={styles.activityContent}>
                 {/* posts list */}
                     <ul className={styles.postlist}>
                       <li>
                       <div className={styles.postcontent}>
                         {
                         item.postOwner == id && 
                            <div className={styles.optionicon}>
                                <BiDotsVerticalRounded/>
                                <div className={styles.optioncontainer}> 
                                  <ul>
                                    <li onClick={()=>showing(item._id,item.body)}>Edit</li>
                                    <li onClick={()=>deletePost(item._id)}>Delete</li>
                                  </ul>

                                  <Modal show={show} onHide={handleClose}>
                                   <Modal.Header closeButton>
                                    <Modal.Title>Edit Post</Modal.Title>
                                  </Modal.Header>
                                    <Modal.Body>
                                    
                                    <div className="form-group" style={{position:"relative"}}>
                                      <label>
                                        <img src={url} className={styles.imgEdit}/>
                                      </label>
                                      <input type="text"
                                      defaultValue={postBody}
                                      className={styles.inputEdit}  
                                      onChange={(e)=>{setPostBody(e.target.value)}}
                                     />
                                      </div>
                                   
                                    </Modal.Body>

                                <Modal.Footer>
                                  <Button variant="secondary" onClick={handleClose}>
                                    Close
                                  </Button>
                                  <button className="btn btn-primary" onClick={()=>handleEditPost()}>
                                    Edit
                                  </button>
                                </Modal.Footer>
                              </Modal>
                              
                              </div>

                              
                             </div>
                         } 
                           

            
                             <div className={styles.ctitle}>
                               <a href="#"><strong>{item.ownerName}</strong></a>
                             </div>
                             <div className={styles.ctime}>{format(item.date)}</div>
                             <p>{item.body}</p>
 
                           </div>
                       </li>
                      </ul>
 
                       {/* comments */}
                        
                       <ul className={styles.commentlist}>

                         {/* first comment */}
                         {
                          item.comments.map(record=>{
                            return ( 
                            <li key={record._id} className={styles.clist}>
                              {record.commentUser == id && 
                              <div className={styles.headercomment}>
                                <div
                                 className={styles.optioniconc}
                                 >
                                <BiDotsVerticalRounded/>
                                <div
                                 className={styles.optioncontainerc}
                                 >
                                  <ul>
                                    <li onClick={()=>showingComModel(item._id,record._id,record.commentBody)}>
                                      Edit
                                      </li>
                                    <Modal show={show2} onHide={handleClose2}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Edit Comment</Modal.Title>
                                </Modal.Header>
                                  <Modal.Body>
                                    {/* {item.body} */}
                                    <div className="form-group" style={{position:"relative"}}>
                                      <label>
                                        <img src={url} className={styles.imgEdit}/>
                                      </label>
                                    <input type="text"
                                     defaultValue={commentBody} 
                                     className={styles.inputEdit} 
                                     onChange={(e)=>{setCommentBodyM(e.target.value)}}
                                     />

                                    </div>
                                   
                                    </Modal.Body>

                                <Modal.Footer>
                                  <Button variant="secondary" onClick={handleClose2}>
                                    Close
                                  </Button>
                                  <button className="btn btn-primary" onClick={()=>handleEditComment()}>
                                    Edit
                                  </button>
                                </Modal.Footer>
                              </Modal>
                                    <li onClick={()=>deleteComment(record._id,item._id)}>Delete</li>
                                  </ul>
                                 
                                 </div>
                             </div>
                              </div>
                             }
                              
                              <a className={styles.photop} >
                                <img src={record.ownerImage} style={{margin:"0px"}}></img>
                              </a>
                              <div className={styles.comcontent}>
                                <div className={styles.ctitle}>
                                  <a href="#"><strong>{record.ownerName}</strong></a>
                                </div>
                                <div className={styles.ctime}>{format(record.commentDate)}</div>
                                <p>{record.commentBody}</p>
  
                              </div>
                          </li>
                          )
                          }).reverse()
                        }
                         
                         
                         {/*  comment input */}
                         <li>
                           <Row>
                             <Col style={{marginTop: "10px" ,marginLeft:"50px"}}>
                             <form onSubmit={(e)=>{
                               e.preventDefault()
                              //  console.log(e.target[0].value)
                               console.log(item._id)
                               makeComment(commentBody,item._id)
                             }} >
                                 <input placeholder="Add a comment" 
                                 className="form-control" 
                                 onChange={(e)=>{setCommentBody(e.target.value)}}
                                //  defaultValue={commentBody}
                                 
                                 />
                                 <button type="submit" className="btn btn-sm btn-primary">Post Comment</button>
                               </form>
                             </Col>
                           </Row>
                           </li>
                       </ul>
                   </div>  
           </div>
            )
          }).reverse()
                    }
       

        </Row>
      </>
        
    )
}

export default Posts
