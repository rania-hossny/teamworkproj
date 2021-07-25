import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route, Link
} from 'react-router-dom';
import {useHistory } from 'react-router-dom';

import background from "./Importance-of-team-building.png";
import JitsiComponent from "./JitsiComponent"
import Teamcontent from "./Teamcontent"
import Header from '../../Components/Navbar/Navbar';

import { Button, Card, Col, ListGroup, Row, Table, Modal, Dropdown, DropdownButton } from 'react-bootstrap'
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { HiOutlineChatAlt2 } from "react-icons/hi";
import styles from './teams.css'
import { RiUserAddLine } from "react-icons/ri";
import * as IconName from "react-icons/bs";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlinePhone } from "react-icons/ai";
import { FaRegAddressCard } from "react-icons/fa"

const Teams = (props) => {
  const history=useHistory();
  const myid=localStorage.getItem("id")
  const [modal, setModal] = useState(false);
  const [teams, setTeams] = useState([])
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id"); //user id
  // console.log(id)
  const [teamName, setTeamName] = useState('');
  const [teamDiscription, setTeamDiscription] = useState('');
  const [teamPhoto, setTeamPhoto] = useState(null);
  const [email, setEmail] = useState("")
  const [idshow, setIdshow] = useState(""); //team id
  const [members, setMembers] = useState([]);
  //edit team
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //modal add team
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  //invite user
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  //view member
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);



  useEffect(() => {
    getTeams();
  }, [])
  async function getTeams() {
    await fetch('https://boiling-shelf-43809.herokuapp.com/team/', {
      headers: {
        "authorization": `${token}`
      }
    })
      .then(resp => resp.json())
      .then(result => {
        setTeams(result.allTeam)
        console.log(result)
      }
      )

  }
  // console.log(data)

  function createTeam(e) {
    e.preventDefault();
    let item = { teamName, teamDiscription, teamPhoto }
    console.warn("item", item)

    const formData = new FormData();
    formData.append('teamName', teamName)
    formData.append('teamDiscription', teamDiscription)
    formData.append("", teamPhoto)
    console.log("form", formData)

    fetch('https://boiling-shelf-43809.herokuapp.com/team/addteam', {
      method: 'POST',
      headers: {
        "authorization": `${token}`
      },
      body: formData
    })
      .then((result => {
        console.warn(result)
        console.log(result.data)
        setTeams(teams)
        getTeams();
      }
      ))
      handleClose2()

  }

  const deleteTeam = (teamId) => {
    console.log(teamId)

    fetch(`https://boiling-shelf-43809.herokuapp.com/team/${teamId}/deleteTeam`, {
      method: "delete",
      headers: {
        "authorization": `${token}`
      },
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = teams.filter(item => item._id !== teamId)
        setTeams(newData)
      }).catch(err => console.log(err))
  }



  const showing = (teamId) => {
    handleShow()
    setIdshow(teamId)
  }
  const showing3 = (teamId) => {
    handleShow3()
    setIdshow(teamId)
    console.log(teamId)
  }
  const showing4 = (teamId) => {
    handleShow4()
    // setIdshow(teamId)
    viewMembers(teamId)
  }

  const handleEditTeam = () => {
    let teamId = idshow
    console.log(teamId)
    let item = { teamName, teamDiscription }
    console.log(item)

    fetch(`https://boiling-shelf-43809.herokuapp.com/team/${teamId}/editTeam`,
      {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "authorization": `${token}`
        },
        body: JSON.stringify(item)
      }).then(res => res.json())
      .then(result => {
        console.log(result)

        handleClose();
        getTeams();
      })
  }
  async function viewMembers(Id) {
    // let Id=idshow
    // console.log(Id)
    fetch(`https://boiling-shelf-43809.herokuapp.com/team/${Id}/viewMember`, {
      headers: {
        "authorization": `${token}`
      }
    })
      .then(resp => resp.json())
      .then(result => {
        setMembers(result.memberData)
        console.log("members",result.memberData)
        
      }
      )
  }
  const inviteUser = () => {
    let teamId=idshow
     let item ={email}
     console.warn("id: ",teamId, "item: ", item)
    fetch(`https://boiling-shelf-43809.herokuapp.com/team/${teamId}/invite`,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "authorization": `${token}`
        },
        body: JSON.stringify(item)
      }).then(res => res.json())
      .then(result => {
        console.log(result)

        handleClose3();

      })
  }

  const leaveTeam = (teamnum) => {
    console.log(teamnum)

    fetch(`https://boiling-shelf-43809.herokuapp.com/team/${teamnum}/leave`,
      {
        method: "POST",
        headers: {
          "authorization": `${token}`
        },

      }).then(res => res.json())
      .then(result => {
        console.log(result)
        // getTeams()
      }).catch((err) => {
        console.log(err)
      })
  }

  const handlechat=(userId)=>{
    console.log(userId)
    

        fetch(`https://boiling-shelf-43809.herokuapp.com/check-conversations/${userId}`,
       { headers:{"authorization":`${token}`}}
        ).then(res=>res.json())
        .then(result=>{
        console.log(result)
        history.push(`/Message?convId=${result.conversation.id}`) 
        })
        .catch(err=>{
            console.log(err)})
    
  }

  return (
    <>
      <Header />
      <div className="bg_image">
      
        <div className="header text-center">
          <button onClick={() => handleShow2()}>Create team <i className="fas fa-plus" style={{fontSize:"28px",paddingLeft:'5px'}}></i></button>
        </div>

        <Modal show={show2} onHide={handleClose2} animation={false}>
                    <Modal.Header closeButton className="modalheader">
                      <Modal.Title>Create Team</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="form-group">
                        <label style={{ "color": "black" ,fontSize:'25px'}}>Team Name</label>
                        <input type="text" className="form-control" value={teamName} onChange={(e) => setTeamName(e.target.value)} name="teamName" />
                      </div>
                      <div className="form-group">
                        <label style={{ "color": "black" ,fontSize:'25px'}} >Description</label>
                        <textarea rows="2" className="form-control" value={teamDiscription} onChange={(e) => setTeamDiscription(e.target.value)} name="teamDescription"></textarea>
                      </div>
                      <div className="form-group">
                        <label style={{ "color": "black" ,fontSize:'25px'}} >Team Image</label>
                        <input type="file" src={teamPhoto} className="form-control" onChange={(e) => { setTeamPhoto(e.target.files[0]) }} name="teamPhoto" />
                      </div>

                    </Modal.Body>
                    <Modal.Footer className="modalheader">
                      <Button variant="secondary" onClick={handleClose2}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={createTeam}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  
        <div className="task-container">

          {teams && teams.map((obj, index) => {

            return (
              
              <Card className="card-wrapper cb1 text-center mr-5" key={obj._id} style={{ width: '16rem' ,background:"transparent" }}>
                    
                <Card.Body className="task-holder">
                  <div className="img-area">
                  <Card.Img variant="top" style={{ width: '100%' ,"borderRadious":"50%"}} src={obj.url} />
                  </div>
                  <Link to={`/Teamcontent/${obj._id}`} style={{ textDecoration: "none", color: "black" }}>
                    <Card.Title className="card-header" style={{ "borderRadius": "35px" }}>{obj.teamName}</Card.Title>
                  </Link>

                
                   <div className="droptog">
                   <Dropdown>
                 <Dropdown.Toggle id="dropdown-basic" variant="light" style={{background:"none",border:"none",color:"gray",fontSize:"50px",marginRight:"-20px",marginTop:"-20px"}} >
                  <BiDotsVerticalRounded />
                 </Dropdown.Toggle>
                 <Dropdown.Menu>
  <Dropdown.Item style={{color:"blue",padding:"10px" ,margin:"5px",fontSize:"large" }} className="far fa-edit mr-5"  onClick={() => showing(obj._id)} > Edit Team</Dropdown.Item>
 
 {obj.teamOwner == id && <Dropdown.Item style={{color:"red",padding:"10px" ,margin:"5px",fontSize:"large"  }} className="fas fa-trash-alt  mr-5" onClick={() => {
                         
                            if (window.confirm('Delete the item?'))
                              deleteTeam(obj._id)
                          
                        }} >   Delete Team</Dropdown.Item>}
  
  
<Dropdown.Item style={{color:"green",padding:"10px" ,margin:"5px",fontSize:"large"  }} className="fas fa-eye" onClick={() =>showing4(obj._id)  } >  View Members</Dropdown.Item>
<Dropdown.Item style={{color:"black", padding:"10px" ,margin:"5px",fontSize:"large" }}  onClick={() => showing3(obj._id)}> <RiUserAddLine/> Invite Member</Dropdown.Item>
<Dropdown.Item style={{color:"red" ,padding:"10px" ,margin:"5px",fontSize:"large" ,display:"block"}} onClick={() => {
                          if (window.confirm('Do you want to leave this team?')) {
                            leaveTeam(obj._id)
                          }
                        }
                        }> <IconName.BsBoxArrowRight />  Leave Team</Dropdown.Item>
                         </Dropdown.Menu>
</Dropdown>
                       
                    </div>

                  
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton className="modalheader">
                      <Modal.Title  > Edit TEAM</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="form-group">
                        <label style={{ "color": "black" ,fontSize: "25px" }}>Team Name</label>
                        <input type="text" className="form-control" value={teamName} onChange={(e) => setTeamName(e.target.value)} name="teamName" />
                      </div>
                      <div className="form-group">
                        <label style={{ "color": "black" ,fontSize: "25px"}} >Description</label>
                        <textarea rows="2" className="form-control" value={teamDiscription} onChange={(e) => setTeamDiscription(e.target.value)} name="teamDescription"></textarea>
                      </div>
                    </Modal.Body>

                    <Modal.Footer className="modalheader">
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <button className="btn btn-primary btn-outline-light" onClick={() => handleEditTeam()}>
                        Save Changes
                      </button>
                    </Modal.Footer>
                  </Modal>


                  {/* <div className={styles.ctitle}>
                               <a href="#"><strong>{obj.teamOwner}</strong></a>
                             </div> */}
                  {/* <div className={styles.ctime}>{obj.date}</div>
                <p>{obj.body}</p> */}


                 
                  <Modal show={show3} onHide={handleClose3} animation={false}>
                    <Modal.Header closeButton className="modalheader">
                      <Modal.Title>Invite User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                      <div className="form-group">
                        <label style={{ "color": "black",fontSize:'25px' }}>User Email</label>
                        <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                      </div>


                    </Modal.Body>
                    <Modal.Footer className="modalheader">
                      <Button variant="secondary" onClick={handleClose3}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" onClick={inviteUser} >
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <Modal show={show4} onHide={handleClose4} animation={false}>
                    <Modal.Header closeButton className="modalheader">
                      <Modal.Title>Team Members</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            {
                                members.map(item=>{
                                    return(
                                        <div key={item.id} style={{display:"flex",justifyContent:"space-between",fontSize:'27px'}}>
                                        <p className="membersdiv">
                                          {item.name}

                                          <Card className="cardmembers"  style={{ width: '22rem',position:"absolute" }}>
                                          <Card.Img variant="top" src={item.url} style={{margin:"0px", borderRadius:"0%", width:"100%"}} />
                                          <Card.Body className="text-center">
                                          <Card.Title><strong>{item.name !== "undefined" && item.name ? item.name : null}</strong></Card.Title>
                
                                            <Card.Title style={{color:"rgba(0,0,0,0.3)"}}>
                                              <strong>{item.bio !== "undefined" && item.bio ? item.bio : null}</strong>
                                            </Card.Title>
                                            <Card.Title>
                                              <strong>{item.track !== "undefined" && item.track ? item.track : null} </strong>
                                            </Card.Title>
                                            <Card.Title>
                                              <strong> {item.email !== "undefined"  && item.email ?<HiOutlineMail /> : null} {item.email !== "undefined" && item.email ? item.email : null}</strong>
                                            </Card.Title>
                                            <Card.Title >
                                              <strong> {item.phone !== "undefined" && item.phone ?<AiOutlinePhone/> : null} {item.phone !== "undefined" && item.phone ? item.phone : null}</strong>
                                            </Card.Title>
                                            <Card.Title >
                                              <strong> {item.address !== "undefined" && item.address ?<FaRegAddressCard/> : null} {item.address !== "undefined" && item.address ? item.address : null}</strong>
                                            </Card.Title>
                                            {
                                               item.id !==myid && <Button  onClick={()=>{handlechat(item.id)}} variant="primary " style={{backgroundColor:'#216583'}}  >
                                               Send message
                                               </Button>
                                            }
                                            
                                          </Card.Body>
                                          
                                        </Card>
                                          </p>
                                        {/* {
                                            item.id !==myid && <IoChatboxEllipsesOutline
                                            onClick={()=>{handlechat(item.id)                                 
                                           }}
                                           style={{color:"#ffc107"}}
                                            />
                                        } */}
                                       
                                         </div>
                                    )
                                })
                            }
                            
                        </Modal.Body>
                    {/* <Modal.Footer className="modalheader">
                    <Button variant="success" onClick={handleClose4}>
                       Ok
                      </Button>
                    </Modal.Footer> */}
                  </Modal>

                  
                </Card.Body>
              </Card>
             
            )
          })
          }
          <Route path="/JitsiComponent" component={JitsiComponent} exact />
        </div>
      </div>
    </>

  )

};

export default Teams;