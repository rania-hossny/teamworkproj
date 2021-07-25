import React ,{useState} from 'react';
import Header from '../../Components/Navbar/Navbar';
// import Teamcontent from './Teamcontent';
import Cardteams from "./Cardteams";



function Teams() {
    const [state, setstate] = useState([]);
    fetch('https://jsonplaceholder.typicode.com/users/1/albums')
    .then((response) => response.json())
    .then((json) =>{
          // console.log(json);
          setstate(json)
      }
     );

   const create=(data)=>{
    fetch('https://jsonplaceholder.typicode.com/users/1/albums', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setstate([...state,json]);
            }
            );
            console.log(state);
   }

   const update=()=>{
       
   }

//    const nameshandler=()=>{
    
//        console.log(state);
//     return state;
// }

    return (
       <>
       <Header/>
             <div>
                <Cardteams cardlist={state} create={create} update={update}/>    
            </div>
       </>
    )
}

export default Teams;
