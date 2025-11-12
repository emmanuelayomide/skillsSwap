import React, { useEffect, useState } from "react";
import useActivityTracker from '../hooks/useActivityTracker';
import WeeklyActivityChart from "../component/WeeklyActivityChart"
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

import { User, Mail, Calendar, LogOut, Rocket, Search, MessageCircleMore, Bell, EllipsisVertical, Hammer, BookOpen, Award } from "lucide-react";
import BackgroundImage from "../images/dashboardslide.png"
import Avater from "../images/avater.jpg"
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userlogId, setUserlogId] = useState(null)

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userValue, setUservalue] = useState(null);
  
//   usersstats

const [userStats, setUserStats] = useState([
    { label: "Skills Offered", value: 0, icon: <Hammer/> },
    { label: "Skills Learned", value: 0, icon: <BookOpen/> },
    { label: "Completed Swaps", value: 0, icon: <Award/> },
  ]);
const b = {
    // stylying my slider image
    backgroundImage: `url(${BackgroundImage})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius:'10px', 
    height: '250px', 
    width: '100%',
    padding:'10px'
  };
        const activityApi = "http://localhost:5000/vi/user/track-activity";
        useActivityTracker(userValue , activityApi )
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.user);
         const userValue =response.data.user.id;
        setName(response.data.user.name);
        setBio(response.data.user.bio || "");
        setUservalue(userValue)
        
      } catch (err) {
        setError("Failed to fetch profile. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSave = () => {
    // TODO: Connect with backend to save updated profile
    setUser({ ...user, name, bio });
    setEditing(false);
    alert("Profile updated (UI only for now)!");
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

// main displayed Content
  return (
    <div className="overallpage">
      
   <div className="dashboard-container">
   <div className="welcomeNAme">
    <h2>Welcome Back {user.name}</h2>
   </div>
     {/* usersnames and the search, notifiction, chat part */}
   <div className="searchandMessageNotification">
    <div className="search">
    <Search size={25}/> <input type="text" placeholder="Search For Anything" />
    </div>
    <div className="message"><MessageCircleMore size={25}/></div>
    <div className="notification"><Bell size={25}/></div>
   </div>
    </div>
     {/* ENd of the usersnames and the search, notifiction, chat part */}
{/* dashbaord Intro and Course */}
<div className="combine">
<div className="upgradingSkills" style={b}>
    <p>ONLINE COURSE</p>
    <h1>Teach, Learn Skills With <span className="break">Expert Online Courses</span> </h1>
    <button>See All</button>
</div>
{/* End of Dashboard intro and Course */}
<div className="profilepart">
    <div className="profileandicon">
        <h3>My Profile</h3>
        <EllipsisVertical/>
    </div>
{/* profilre Picture */}
<div className="profilePicture">
    <div className="avater">    <img src={Avater} alt="default avater image" className="avaterimg" /></div>
    <div className="username">
        <h3>{user.name}</h3>
        <p>Student</p>
    </div>
</div>
</div>

</div>
{/* the courses Enrolled and lessons */}
<div className="plusanalysis">  
<div className="cgc">
{userStats.map((stats,index)=>(
    <div key={index} className={`stats${index}`}>
        <div className="iconstats">{stats.icon}</div>
        <div className="valuestats">
            <h4>{stats.value}</h4>
            <p>{stats.label}</p>
        </div>
    </div>
))}
</div>
<div className="analysisitself">
  {/* the Users Active time Analysis part component */}
   <WeeklyActivityChart />
</div>
</div>

    </div>
 
  );
};

export default Dashboard;
