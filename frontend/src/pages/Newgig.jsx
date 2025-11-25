import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Newgig.css";
import { ArrowLeft, X, NotebookPen, Check, Eye} from 'lucide-react';
import Gigillustration from "../images/gigillustration.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate, useNavigate } from "react-router-dom";

function Newgig() {
const handlePreview = ()=>{
    Navigate("/gigPreview")
}


    
const Navigate = useNavigate()

    const [step, setStep] = useState(1);

    const categories = {
        "Web Development": ["Web Programming", "E-commerce Development", "API Development", "Responsive Web Design"],
        "Frontend Development": ["React.js", "Vue.js", "Angular", "CSS Frameworks"],
        "Backend Development": ["Node.js", "Express.js", "Database Integration", "API Development"],
        "React.js": ["Hooks", "State Management", "Routing", "Component Design"]
    };

    // Step 1
    const [gigTitle, setGigTitle] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");

    // Step 2 (Rich Text Editor)
    const [description, setDescription] = useState("");
    const [isStep2Loaded, setIsStep2Loaded] = useState(false); 

  
    // Step 3 (Tags)
const [tags, setTags] = useState([]);
   const [isStep3Loaded, setIsStep3Loaded] = useState(false); 
const [tagInput, setTagInput] = useState("");

// step 4 (gig image)

const [gigImagePreview, setGigImagePreview] = useState(localStorage.getItem("skillSwapGigImage") || null);
const [gigFile, setGigFile] = useState(null);
const [isPublishing, setIsPublishing] = useState(false);





// image Error message that i used 

const [imageError, setImageError] = useState("");

const [isStep1Loaded, setIsStep1Loaded] = useState(false);

// maxiximum image Creation reached 
const [limit, setLimit] = useState("")

  const handleStep1Next = () => {
        if (gigTitle && selectedCategory && selectedSubcategory) {
            setStep(2);
        }
    };

    // Step 2 Next Handler
    const handleStep2Next = () => {
        const plainText = description.replace(/<[^>]+>/g, "").trim();
        if (!plainText) return; 
        setStep(3);
    };
// --- STEP 1: Auto-save draft for Step 1 ---
// Load draft once
useEffect(() => {
    const savedDraft = localStorage.getItem("skillSwapGigDraftStep1");
    if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        setGigTitle(draft.gigTitle || "");
        setSelectedCategory(draft.selectedCategory || "");
        setSelectedSubcategory(draft.selectedSubcategory || "");
        setStep(draft.step || 1);
    }
    setIsStep1Loaded(true); // now we can start saving
}, []);

// Auto-save only after initial load
useEffect(() => {
    if (!isStep1Loaded) return; 
    const draft = {
        gigTitle,
        selectedCategory,
        selectedSubcategory,
        step
    };
    localStorage.setItem("skillSwapGigDraftStep1", JSON.stringify(draft));
}, [gigTitle, selectedCategory, selectedSubcategory, step, isStep1Loaded]);


useEffect(() => {
    const savedDraft = localStorage.getItem("skillSwapGigDraftStep2");
    if (savedDraft) {
        setDescription(savedDraft);
    }
    setIsStep2Loaded(true);
}, []);


useEffect(() => {
    if (!isStep2Loaded) return; 
    localStorage.setItem("skillSwapGigDraftStep2", description);
}, [description, isStep2Loaded]);


useEffect(() => {
    const savedDraft = localStorage.getItem("skillSwapGigTag3");
    if (savedDraft) {
        try {
            setTags(JSON.parse(savedDraft));
        } catch (err) {
            console.warn("Tags in localStorage are invalid, resetting...");
            setTags([]);
        }
    }
    setIsStep3Loaded(true);
}, []);

useEffect(() => {
    if (!isStep3Loaded) return;
    localStorage.setItem("skillSwapGigTag3", JSON.stringify(tags));
}, [tags, isStep3Loaded]);


// gig image
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImageError(""); 

  // Check type
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    setImageError("Only JPEG and PNG files are allowed.");
    setGigFile(null);
    return;
  }

  // Check size
  if (file.size > 50 * 1024 * 1024) {
    setImageError("File too large. Maximum 50MB allowed.");
    setGigFile(null);
    return;
  }

  // ✅ Set file immediately for backend use
  setGigFile(file);

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const minWidth = 712, minHeight = 430;
      const recommendedWidth = 1280, recommendedHeight = 769;

      if (img.width < minWidth || img.height < minHeight) {
        setImageError(`Image too small. Minimum: ${minWidth}x${minHeight}px.`);
        setGigFile(null); // prevent sending invalid image
        return;
      }

      if (img.width !== recommendedWidth || img.height !== recommendedHeight) {
        console.warn(`Recommended: ${recommendedWidth}x${recommendedHeight}px.`);
      }

      // Set preview (for UI)
      setGigImagePreview(event.target.result);
      localStorage.setItem("skillSwapGigImage", event.target.result);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};




// sending the data to the backend 


const handlePublish = async () => {
  if (!gigFile) {
    alert("Image missing");
    return;
  }

  setIsPublishing(true); // start spinner

  const formData = new FormData();
  formData.append("title", gigTitle);
  formData.append("category", selectedCategory);
  formData.append("subcategory", selectedSubcategory);
  formData.append("description", description);
  formData.append("tags", JSON.stringify(tags));
  formData.append("image", gigFile);

  const token = localStorage.getItem("token");

  try {
    // Minimum 2-second delay promise
    const delay = new Promise(resolve => setTimeout(resolve, 1000));

    // Axios request
    const responsePromise = axios.post(
      "http://localhost:5000/api/user/gigs",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Wait for BOTH the request and the delay
    const [response] = await Promise.all([responsePromise, delay]);

    if (response.status === 200 || response.status === 201) {

      Navigate("/gigsoffered")
      // clear localStorage and reset state
      localStorage.removeItem("skillSwapGigDraftStep1");
      localStorage.removeItem("skillSwapGigDraftStep2");
      localStorage.removeItem("skillSwapGigTag3");
      localStorage.removeItem("skillSwapGigImage");

      setStep(1);
      setGigTitle("");
      setSelectedCategory("");
      setSelectedSubcategory("");
      setDescription("");
      setTags([]);
      setGigFile(null);
      setGigImagePreview(null);
    }
  } catch (err) {
    console.error(err);
    setLimit(err.response?.data?.message || "Error connecting to server");
      
    setTimeout(()=>{
        setLimit("")
    }, 2000)
  } finally {
    setIsPublishing(false); // stop spinner
  }
};








    return (
    <>
        {isPublishing && (
  <div className="overlay">
    <div className="spinner"></div>
  </div>
)}



        
        <div className="createNewGigOverall">


            {/* TOP PROGRESS STEPS */}

              {limit && (
                <div className="messageErrorDisplay">
                    <p>{limit}</p>
                </div>
            )}
            <div className="plusPreview"> 

            {/* sections loading Design */}
          
            <div className="stepsBar">
                <div className={step >= 1 ? "activeStep" : ""}> 1 Overview </div>
                <div className={step >= 2 ? "activeStep" : ""}>2 Description</div>
                <div className={step >= 3 ? "activeStep" : ""}>3 Tags</div>
                <div className={step >= 4 ? "activeStep" : ""}>4 Gallery</div>
                <div className={step >= 5 ? "activeStep" : ""}>5 Publish</div>
            </div>
            <div className="previewpart">
                <div className="Combinetogther"> 
                 <button onClick={handlePreview}> <Eye/> Preview</button>
                </div>  

            </div>

            </div>

            {/* ========== STEP 1 ========= */}
            {step === 1 && (
                <>
                    <div className="twosection">
                        <div className="firstContainer">
                            <h3>Discover What Skills Are in Demand! →</h3>
                            <p>Connect with learners and experts on SkillSwap to see which skills are trending.</p>
                            <a href="#">Start Swapping Skills</a>
                        </div>

                        <div className="imagepart">
                            <img src={Gigillustration} alt="Illustration" />
                        </div>
                    </div>

                    <div className="formactivities">
                        {/* Gig Title */}
                        <div className="firstInfor">
                            <div className="textinfo">
                                <h2>Your Gig Title Matters</h2>
                                <p>Include keywords people would likely search when looking for your skill.</p>
                            </div>
                            <div className="formInfo">
                                <input
                                    type="text"
                                    placeholder="What I will teach..."
                                    className="what"
                                    value={gigTitle}
                                    onChange={(e) => setGigTitle(e.target.value)}
                                />
                                {!gigTitle.trim() && <p className="errorMsg">Gig title is required</p>}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="secondInfo">
                            <div className="sec1">
                                <h2>Choose Your Category</h2>
                                <p>Pick the most accurate category for your gig.</p>
                            </div>

                            <div className="sec2">
                                <div className="sec2a">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => {
                                            setSelectedCategory(e.target.value);
                                            setSelectedSubcategory("");
                                        }}
                                        className="selectCategory"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Frontend Development">Frontend Development</option>
                                        <option value="Backend Development">Backend Development</option>
                                        <option value="React.js">React.js</option>
                                    </select>
                                    {!selectedCategory && <p className="errorMsg">Please select a category</p>}
                                </div>

                                <div className="sec2b">
                                    <select
                                        className="selectSubCategory"
                                        disabled={!selectedCategory}
                                        value={selectedSubcategory}
                                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                                    >
                                        <option value="">
                                            {selectedCategory ? "Select Subcategory" : "Choose category first"}
                                        </option>
                                        {selectedCategory &&
                                            categories[selectedCategory]?.map((sub, index) => (
                                                <option key={index} value={sub}>{sub}</option>
                                            ))}
                                    </select>
                                    {!selectedSubcategory && <p className="errorMsg">Please select a subcategory</p>}
                                </div>
                            </div>
                        </div>

                        <div className="setElement">
                            <button
                                onClick={handleStep1Next}
                                className="nextBtn"
                                disabled={!gigTitle || !selectedCategory || !selectedSubcategory}
                            >
                                Save & Continue
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ========== STEP 2 — DESCRIPTION (Rich Text) ========= */}
            {step === 2 && (
                <div className="stepSection">
 <div className="twosection">
                        <div className="firstContainer">
                            <h3>Build Powerful Skill Offers That Attract the Right Clients →</h3>
                            <p>With SkillSwap Boost, you can refine your service descriptions, get smart suggestions powered by AI, and discover insights that help your offers stand out in the marketplace.</p>
                            <a href="#">Unlock your potential →</a>
                        </div>

                        <div className="imagepart">
                            <img src={Gigillustration} alt="Illustration" />
                        </div>
                    </div>




                    <h2>Describe Your Gig</h2>
                    <p>This helps learners know exactly what you offer.</p>

                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        modules={{
                            toolbar: [
                                ["bold", "italic", "underline", "strike"],
                                [{ 'align': [] }],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["link"]
                            ]
                        }}
                        formats={[
                            "bold", "italic", "underline", "strike",
                            "align", "list", "bullet", "link"
                        ]}
                        placeholder="Write a detailed description of what you will teach..."
                        className="myQuillEditor"
                    />
                    {description.replace(/<[^>]+>/g, "").trim() === "" && (
                        <p className="errorMsg">Description is required</p>
                    )}

                    <div className="btnGroup">
                        <ArrowLeft onClick={() => setStep(1)} className="backBtn" />
                        <button
                            onClick={handleStep2Next}
                            className="nextBtn"
                            disabled={description.replace(/<[^>]+>/g, "").trim() === ""}
                        >
                            Save & Continue
                        </button>
                    </div>
                </div>
            )}

            {/* ========== STEP 3 — TAGS ========= */}
    
{step === 3 && (
    <div className="stepSection">



         <div className="twosection">
                        <div className="firstContainer">
                            <h3>Add Tags to Help People Find Your Skill Faster →</h3>
                            <p>Use short keywords that describe your service.  This helps your SkillSwap listing show up in search results..</p>
                           
                        </div>

                        <div className="imagepart">
                            <img src={Gigillustration} alt="Illustration" />
                        </div>
                    </div>
                    
        <h2>Add Search Tags</h2>
        <p>Add up to 5 keywords people might use to find this gig.</p>

        {/* TAG INPUT FIELD */}
        <input
            type="text"
            placeholder="Type a tag and press Enter"
            className="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();

                    const newTag = tagInput.trim().toLowerCase();

                    if (!newTag) return;                      
                    if (tags.includes(newTag)) return;            
                    if (tags.length >= 5) return;              

                    setTags([...tags, newTag]);                   
                    setTagInput("");                          
                }
            }}
        />

        {/* SHOW TAGS */}
        <div className="tagsList">
            {tags.map((tag, index) => (
                <div className="tag" key={index}>
                    {tag}
                    <X className="removeTag" onClick={() => { setTags(tags.filter((t) => t !== tag)); }} />
                     
                </div>
            ))}
        </div>

        <div className="btnGroup">
            <ArrowLeft onClick={() => setStep(2)} className="backBtn" />

            {/* NEXT BUTTON DISABLED IF NO TAGS */}
            <button
                onClick={() => setStep(4)}
                className="nextBtn"
                disabled={tags.length === 0}
            >
                Save & Continue
            </button>
        </div>
    </div>
)}


            {/* ========== STEP 4 — IMAGE UPLOAD ========= */}
{step === 4 && (
  <div className="stepSection">
    <h2>Showcase Your Skill in the Gallery</h2>
    <p>Encourage learners to choose your skill by featuring an image that represents your service.</p>

    {/* Guidelines box */}
    <div className="guidelinesBox">
        <div className="make">
      <NotebookPen/>  <p>Make sure your image is clear and represents the skill you’re offering.</p>
       </div>
       <div className="make">
       <Check/> <p> Recommended: JPEG, PNG. Max size: 10MB.</p>
       </div>
    </div>

    {/* Clickable image box */}
    <div
      className="imageUploadBox"
      onClick={() => document.getElementById("gigFileInput").click()}
    >
      {gigImagePreview ? (
        <img src={gigImagePreview} alt="Gig Preview" className="previewImage" />
      ) : (
        <p>Click here to upload an image for your SkillSwap gig</p>
      )}
    </div>

    {imageError && (
    <p className="errorMsg" style={{ color: "red", marginTop: "10px" }}>
        {imageError}
    </p>
)}


    {/* Hidden input */}
<input
  type="file"
  id="gigFileInput"
  accept="image/*"
  style={{ display: "none" }}
  onChange={handleImageUpload}
/>




    <div className="tipBox">
      <h4>Tip</h4>
      <p>Make sure you add a good and high Quality images to attract Learners and easy Connection.</p>
    </div>

    {/* Navigation buttons */}
    <div className="btnGroup">
      <ArrowLeft onClick={() => setStep(3)} className="backBtn" />
      <button
        onClick={() => setStep(5)}
        className="nextBtn"
        disabled={!gigImagePreview || imageError}
      >
        Save & Continue
      </button>
    </div>
  </div>
)}

            {/* ========== STEP 5 — PUBLISH ========= */}
            {step === 5 && (
                <div className="stepSection">
                    <h2>Publish Your Gig</h2>
                    <p>Everything looks good! Click below to finish.</p>

                    <div className="spaceoverall">
                        <ArrowLeft onClick={() => setStep(4)} className="backBtn" />
                       <button className="publishBtn" onClick={handlePublish} disabled={isPublishing}>
  {isPublishing ? "Publishing..." : "Publish Gig"}

</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default Newgig;
