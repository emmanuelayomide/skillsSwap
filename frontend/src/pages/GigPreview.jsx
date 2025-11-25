import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GigPreview.css"
// importing icons
import {House, Pencil, CheckLine, MoveRight} from "lucide-react";
// default Avalter
import Avater from "../images/avater.jpg"

// importing the default image used
import Hand from "../images/hand.png"

function GigPreview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Gig data states
  const [gigTitle, setGigTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsVerified(true);
          setUser(response.data.selectUser)
          console.log(response.data.message)
          console.log(user)

          // Fetch gig data from localStorage
          const step1 = JSON.parse(localStorage.getItem("skillSwapGigDraftStep1")) || {};
          const step2 = localStorage.getItem("skillSwapGigDraftStep2") || "";
          const step3 = JSON.parse(localStorage.getItem("skillSwapGigTag3")) || [];
          const gigImg = localStorage.getItem("skillSwapGigImage") || null;

          setGigTitle(step1.gigTitle || "");
          setCategory(step1.selectedCategory || "");
          setSubcategory(step1.selectedSubcategory || "");
          setDescription(step2);
          setTags(step3);
          setImage(gigImg);
        } else {
          navigate("/login");
        } 
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isVerified) return null;


  return (
    <div className="gigPreviewContainer">

        <div className="fullshare">
            <div className="firstShare">
                <div className="f1">
                    <img src={Hand} alt="a hand as an Illustration" />
                </div>
                <div className="f2">
                    <h1> Your skills deserve the spotlight! Spread the word,</h1>
                    <p>Showcase your skills, reach new clients! Share your profile and gigs on social media to connect, grow your network, and land more orders.</p>
                </div>
            </div>
            <div className="secondShare">
                <button>Share Your Gig</button>
            </div>
        </div>
<div className="homepluscategoryedit">
    <div className="homecat">
      <p><House/></p>
    <p><a href="#">/ {category}</a></p>
    <p><a href="#">/ {subcategory}</a></p>
    </div>
    <div className="edit">
      <button><Pencil/> Edit Gig</button>
    </div>

</div>
<div className="gigTitleandCard">
  <div className="fullDetails">
    <h1>{gigTitle}</h1>
    <div className="profileImageset">
      <div className="profile">
        <img src={user.profileimg ? `http://localhost:5000/${user.profileimg} `: Avater } alt="user profile image" />
      </div>
     <h3 className="userName">{user.name}</h3>
    </div>
{/* displaying Gig Image */}
<div className="gigImage">
  <img src={image} alt="The  user Gig image" />
</div>

<div className="aboutGig">
 
<div dangerouslySetInnerHTML={{__html: description }} />

</div>

 <div className="tagsPart">
     {tags.map((t, index)=>(
      <button className="tagsbutton">{t}</button>
     ))}

    </div>
  </div>

   
  <div className="cards">
  <div className="cardDisplay">
    <div className="amount">
      <b>Price</b>
      <p className="nomoney">$0</p>
    </div>
    <hr />
    <p className="gigTitle">{gigTitle}</p>
    <div className="bonus">
      <div className="straightLine"><CheckLine color="#9017fabb"/> <p>Instant Connection </p></div>
    <div className="straightLine"><CheckLine color="#9017fabb"/><p>Build Project Together </p></div>
  <div className="straightLine"><CheckLine color="#9017fabb"/> <p>Assignment </p></div>

    </div>
<button className="right">Continue  <MoveRight/></button>
  </div>
 
  </div>
</div>
    </div>
  )
}

export default GigPreview;
