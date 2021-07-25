
import React, { useState,useEffect } from 'react'

import {useHistory } from 'react-router-dom';


import { Button, Card, Col, ListGroup, Modal, Row } from 'react-bootstrap';

import { Link} from 'react-router-dom';
import Files from './Files';
// import Navteam from './Navteam';
import Posts from './Posts';
import { RiSendPlaneFill } from "react-icons/ri";
import { RiUserAddLine } from "react-icons/ri";
import { BsFilePost } from "react-icons/bs";
import { VscFiles } from "react-icons/vsc";
import { MdVideoCall } from "react-icons/md";
import { BiCalendarPlus } from "react-icons/bi";
import styles from "./teamcontent.module.css";
import Header from '../../Components/Navbar/Navbar';
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

// import photo from "./depositphotos_124789918-stock-photo-teamwork-and-teambuilding-concept-in.jpg"
// import photo2 from "./pietra-schwarzler-FqdfVIdgR98-unsplash.jpg"

const Teamcontent = (props) => {
  const [email, setEmail] = useState("")
    const history=useHistory();
    const myid=localStorage.getItem("id")
    let local=JSON.parse(localStorage.getItem("user-info"))
    const urluser = local.user.url;
    console.log(props)
    const id=props.match.params.id; //team id
    const token = localStorage.getItem("token");
    // console.log(id)
    const [members, setMembers] = useState([]);
    const [currentTeam, setCurrentTeam] = useState({});

    const [meetingName, setMeetingName] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");


    // model view member
    const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    
//   model invite member
const [show2, setShow2] = useState(false);
const handleClose2 = () => setShow2(false);
const handleShow2 = () => setShow2(true);

//   model shcedule
const [show3, setShow3] = useState(false);
const handleClose3 = () => setShow3(false);
const handleShow3 = () => setShow3(true);

const [start, setStart] = useState(null)


// const event2 = new Date("2021-07-23");
// event2.setTime("06:47");
// const time="12.56 pm"
// const date="2021-07-23"
// const event2 = new Date("2021-07-23 06:47");
// const event2 = new Date(date + " " + time);


  useEffect(() => {
    fetch(`https://boiling-shelf-43809.herokuapp.com/team/${id}/viewMember`,{
        headers:{"authorization":`${token}`}
    }).then(resp=>resp.json())
    .then(result=>{
        setMembers(result.memberData)
        console.log("members",result.memberData)
    })
//     setStart(new Date(date + " " + time))
// console.log("start",start)
  },[])

  useEffect(() => {
    fetch(`https://boiling-shelf-43809.herokuapp.com/team/`,{
        headers:{"authorization":`${token}`}
    }).then(resp=>resp.json())
    .then(result=>{
        console.log(result.allTeam)
        const result2=result.allTeam.filter((item)=>{
            if(item._id==id){
              return item
            }
          })
          console.log("result2",result2[0])
          setCurrentTeam(result2[0])
    })
  },[])
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

  const showing3=(meetingName,date,time)=>{
    handleShow3()
    setMeetingName(meetingName)
    setDate(date)
    setTime(time)
  }
  const handlemeeting=(meetingName,date,time)=>{
      console.log(meetingName)
      console.log(date)
      console.log(time)
      const item={meetingName,time,date}
      console.log(item)
      fetch(`https://boiling-shelf-43809.herokuapp.com/calendar/${id}`,
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
      console.log("eventadded",result)})
    console.log(meetingName)
    handleClose3()
  }
//   const inviteUser = () => {
//     let teamId=idshow
//      let item ={email}
//      console.warn("id: ",teamId, "item: ", item)
//     fetch(`https://boiling-shelf-43809.herokuapp.com/team/${teamId}/invite`,
//       {
//         method: "POST",
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           "authorization": `${token}`
//         },
//         body: JSON.stringify(item)
//       }).then(res => res.json())
//       .then(result => {
//         console.log(result)

//         handleClose2();

//       })
//   }
    return (
       <>
       <Header/>
         <div >
                
            <Row>
                  {/* sidebar */}
            <Col className={styles.sidebarteam} md={3}>

                    {/* teams Card */}
                    <Card className={styles.cardposts}  style={{ width: '20rem' }}>
                    <Card.Header className={styles.sidetitle} >
                       <h4> {currentTeam.teamName}</h4>
                        <div className={styles.iconsdiv}>
                        {/* <RiUserAddLine 
                        className={styles.iconcard} 
                        style={{marginRight:"15px",cursor:"pointer"}}
                        onClick={handleShow2}
                        /> */}

                        <BiCalendarPlus className={styles.iconcard}
                         style={{marginRight:"15px",cursor:"pointer"}}
                         onClick={()=>showing3(meetingName,date,time)}
                         />
                        <Link to="/JitsiComponent">
                        <MdVideoCall className={styles.iconcard}/>
                        </Link>
                        </div>

                        {/* modal invite */}

                        {/* <Modal show={show2} onHide={handleClose2}>
                            <Modal.Header closeButton>
                            <Modal.Title>Invite User</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                      <div className="form-group">
                        <label style={{ "color": "black",fontSize:'25px' }}>User Email</label>
                        <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                      </div>


                    </Modal.Body>
                    <Modal.Footer className="modalheader">
                      <Button variant="secondary" onClick={handleClose2}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" onClick={inviteUser} >
                        Save Changes
                      </Button>
                    </Modal.Footer>
                        </Modal> */}

                        {/* modal shcedule */}
                        <Modal show={show3} onHide={handleClose3}>
                            <Modal.Header closeButton>
                            <Modal.Title>schedule meeting</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{paddingBottom:'20px'}}>
                            <div className="form-group">
                            <label style={{ "color": "black" ,fontSize:'20px'}}>Meeting name</label>
                            <input style={{paddingBottom:'20px'}} type="text" className="form-control" onChange={(e)=>setMeetingName(e.target.value)}  />
                             </div>
                                 <label style={{ "color": "black" ,fontSize:'20px'}}>Start Date</label>
                                <input style={{paddingBottom:'7px',paddingTop:'7px',paddingLeft:"10px",border:"1px solid #ced4da",paddingRight:"10px"}} type="date" onChange={(e)=>setDate(e.target.value)} />
                                
                                 <label style={{ "color": "black" ,fontSize:'20px'}}>Start Time</label>      
                                <input style={{paddingBottom:'7px',paddingTop:'7px',paddingLeft:"10px",border:"1px solid #ced4da",paddingRight:"10px"}} type="time" onChange={(e)=>setTime(e.target.value)} />
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose3}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={()=>handlemeeting(meetingName,date,time)}>
                                Schedule
                            </Button>
                            </Modal.Footer>
                        </Modal>

                    </Card.Header>
                    <Card.Img className={styles.imgteam} style={{marginTop:"10px", borderRadius:"0%",width:"90%",marginLeft:"15px"}} variant="top" src={currentTeam.url} />
                    <Card.Body className="text-center">
                        
                        <Card.Text>
                        {currentTeam.teamDescription}
                        </Card.Text>
                        {/* <Button variant="primary" onClick={handleShow}>View members</Button>

                        <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Team members</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {
                                members.map(item=>{
                                    return(
                                        <div key={item.id} style={{display:"flex",justifyContent:"space-between",fontSize:'27px'}}>
                                        <p>{item.name}</p>
                                        {
                                            item.id !==myid && <IoChatboxEllipsesOutline
                                            onClick={()=>{handlechat(item.id)                                 
                                           }}
                                           style={{color:"#ffc107"}}
                                            />
                                        }
                                        
                                         </div>
                                    )
                                })
                            }
                            
                        </Modal.Body>
                    </Modal> */}

                    </Card.Body>
                    </Card>

                    {/* teams Category */}
                    <Card className={styles.cardposts} style={{ width: '20rem' }}>
                    <Card.Header className={styles.sidetitle}>Category</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item style={{padding:"0px"}}> 
                            <Link to={"/Teamcontent/"+id} className={styles.categorylist}>
                                 <BsFilePost/> Posts</Link>
                            </ListGroup.Item>
                        <ListGroup.Item style={{padding:"0px"}}>
                            <Link to={"/files/"+id} className={styles.categorylist}>
                                <VscFiles/> Files</Link>
                            </ListGroup.Item>
                        
                    </ListGroup>
                    </Card>
        
                </Col>

                <Col md={9}>
                    {/* posts content */}
                    <Posts id={id}/>
                </Col>    
               </Row>
               
        </div>

        </> 
    )
      
}

export default Teamcontent
