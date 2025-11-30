
import React, { useState, useEffect } from "react";
import "./Gigs.css"
import { Link } from "lucide-react"

import {useNavigate } from "react-router-dom"
import axios from "axios";



const Gigs = ()=>{
const navigate = useNavigate();
const [activegig, setActivegig] = useState(null)
const [gigsDiplayed, setgigsDisplayed] = useState ([])
const [selectedGigs, setSelectedGigs] = useState([]);
const [selectAll, setSelectAll] = useState(false);
const [gigmessage, setGigmessage] = useState("")
const [createGigStatus, setCreateGigStatus] = useState("")


    
useEffect(()=>{
const token = localStorage.getItem("token")
   
const getGigsDetails = async() =>{ 
    try{
const getGigs = await axios.get("http://localhost:5000/api/user/getgig", { headers:{Authorization: `Bearer ${token}`}})
const avalaiblegigs = getGigs.data.gigs;

setActivegig(avalaiblegigs.length)
console.log(activegig)
setgigsDisplayed(avalaiblegigs)   //The name that Hold the user Gig for me 
console.log(gigsDiplayed)

     }catch(err){
console.log(err.message)
    }

     
}
  
getGigsDetails()
}, [navigate])

const handleSelectOne = (gigId) => {
  let updatedList;

  if (selectedGigs.includes(gigId)) {

    updatedList = selectedGigs.filter(id => id !== gigId);
  } else {

    updatedList = [...selectedGigs, gigId];
  }

  setSelectedGigs(updatedList);

  
  if (updatedList.length === gigsDiplayed.length) {
    setSelectAll(true);
  } else {
    setSelectAll(false);
  }
};


const handleSelectAll = () => {
  if (selectAll) {
   
    setSelectedGigs([]);
    setSelectAll(false);
  } else {
  
    const allIds = gigsDiplayed.map(g => g.id);
    setSelectedGigs(allIds);
    setSelectAll(true);
  }
};

 
    const gignames = [
    {id:1,name:"Active", path:"/active", total:activegig},
    {id:1,name:"Pending", path:"/pending"},
    {id:1,name:"Draft", path:"/draft"}
]
// texting usersGigDiplayed
const handleGigDelete = async () => {
  const token = localStorage.getItem("token");

  try {
    const deleting = await axios.post(
      "http://localhost:5000/api/user/deletegigs",
      { gigIds: selectedGigs },  
      { headers: { Authorization: `Bearer ${token}` } }
    );

    
    setgigsDisplayed(
      gigsDiplayed.filter(gig => !selectedGigs.includes(gig.id))
    );


    setSelectedGigs([]);
    setSelectAll(false);
   setGigmessage("Gig Deleteed Successfully")


     setTimeout(() => {
      setGigmessage("");
    }, 3000);


} catch (error) {
    console.log("Delete error:", error);
  }
};
 const handleCreateGig = async () => {
  try {
    const checkGigtotal = "http://localhost:5000/api/user/useraccountgig";
    const token = localStorage.getItem("token");
    const waittoVerify = await axios.get(checkGigtotal, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // This runs if status code is 200
    const approvedNumber = waittoVerify.data.gigcount;
    if (approvedNumber < 5) {
      navigate("/createNewGig");
    }
  } catch (err) {
    
    if (err.response) {
      const message = err.response.data.message; 
      setCreateGigStatus(message);

      setTimeout(() => {
        setCreateGigStatus("");
        navigate("/gigsoffered"); 
      }, 3000);
    } else {
      console.log(err.message);
    }
  }
};



    return(
        <div className="generalGigs">
            <div className="ShowingMessageifo">
                {gigmessage && (
                    <div className="shortDisplay"> <p>{gigmessage}</p></div>
                )}
            </div>
             <div className="ShowingMessageifo">
                {createGigStatus && (
                    <div className="shortDisplay"> <p>{createGigStatus}</p></div>
                )}
            </div>
          
            <div className="pageName">
                <h1>Gigs</h1>
            </div>
            <div className="gigstatuspluscreate">
                <div className="status">
                    {gignames.map((gig, index)=>(
                        <div key={index} className="totalfront"> 
                        <a href={gig.path} >{gig.name}  </a>
                        {gig.total ? <span className="total">{gig.total}</span>: ""}
                   </div> ))}

                </div>
            
                <div className="create">
               <button onClick={handleCreateGig}>Create New Gig</button>
                </div>
            </div>
<hr />
            {/* diplying the gigs if available or not */}
            <div className="overallGig">

           
            <div className="gigDiplayed">
                <div className="checkgigname">
                 {gigsDiplayed.length>0 && ( <input type="checkbox" className="checkbox"   checked={selectAll} onChange={handleSelectAll}/>)}  
 
                    <h3>Gig</h3>
                </div>
                <div className="fourList">
                    <div className="thesameWidth1">
                    <p>Category</p>
                    </div>
                    <div className="thesameWidth2">
                        <p>Status</p> 
                    </div>
                  <div className="thesameWidth3">
                    <p>Student</p>
                  </div>
                    <div className="thesameWidth4">
                    <p>Sessions</p>
                    </div>
                </div>

            </div>
           {gigsDiplayed.length!=0 ? (
             <div className="rendringgigs">
               
                {gigsDiplayed.map(gigs=>(
                    <div key={gigs.id} className="mygig">
                        <div className="gigimageandtitle"> 
                            <input type="checkbox" className="checkbox" checked={selectedGigs.includes(gigs.id)} onChange={()=> handleSelectOne (gigs.id)} />
                            <img src={`http://localhost:5000/${gigs.image}`} alt="the gig images" />
                            <a href="#">{gigs.title}</a>
                        </div>
                        <div className="gigAnalysis">
                            <div className="thesameWidth1">
                            <p>{gigs.category}</p>
                            </div>
                            <div className="thesameWidth2">
                            <p>{gigs.subcategory}</p>
                            </div>
                            <div className="thesameWidth3">
                            {gigs.student? (<p>{gigs.student}</p>):<p>0</p> }
                             
                            </div>
                            <div className="thesameWidth4">
                              {gigs.rating? (<p>{gigs.rating}</p>):<p>0</p> }
                            </div>
                        </div>
                    </div>
                ))}
              
            </div>
           ) : 
           (
            <div className="nogigYet">
                <p>There is no Active gig yet, try Creating Gig</p>
            </div>
           )}
             </div>

             {/* showing the delete Button on selected Gigs */}
                    {selectedGigs.length > 0 && (
                    <button className="delete-btn" onClick={handleGigDelete}>
                        Delete Selected ({selectedGigs.length})
                    </button>
                    )}

        </div>
       )
}

export default Gigs;