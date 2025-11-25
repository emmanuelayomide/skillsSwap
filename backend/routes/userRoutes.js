import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
const router = express.Router();
const prisma = new PrismaClient();




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save inside uploads folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user_${Date.now()}${ext}`); // unique filename
  },
});

// Filter only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// accessing profiles data
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // req.user contains the decoded info from the token
    const user = await prisma.user.findUnique({
   where:{id:req.user.id},
      select: { id: true, name: true, email: true, createdAt: true ,profileimg: true  },
    });
   

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     const skilledOffered = await prisma.gig.findMany({where:{userId:req.user.id}})
    console.log(skilledOffered.length)

    return res.status(200).json({ message: "Profile fetched successfully ", user, skilledOffered });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// getting and changing profile picture path
router.post("/upload-profile-image", verifyToken, upload.single("profileImg"), async (req, res) => {
  try {
    const userId = req.user.id;
    const imagePath = req.file.path; // e.g. uploads/user_123.png

  const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { profileimg: imagePath },
  select: {
    id: true,
    name: true,
    email: true,
    profileimg: true,
    createdAt: true
  },
});

    res.status(200).json({
      message: "Profile image uploaded successfully!",
      user: updatedUser,
    });
    console.log(updatedUser)
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// saving gigs to the database

const gigStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/gigs/"); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `gig_${Date.now()}${ext}`); 
  },
});


const gigFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const uploadGigImage = multer({ storage: gigStorage, fileFilter: gigFileFilter });

router.post("/gigs", verifyToken, uploadGigImage.single("image"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, category, subcategory, description, tags } = req.body;
    const imagePath = req.file.path; 
  const checkMaximum = await prisma.gig.findMany({where:{userId:userId}})
  if(checkMaximum.length<=3){
const newGig = await prisma.gig.create({
      data: {
        userId,
        title,
        category,
        subcategory,
        description,
        tags: tags ? JSON.parse(tags) : [],
        image: imagePath,
        
      }
    });

    res.status(201).json({
      message: "Gig created successfully!",
      gig: newGig,
    });
  }
    else{
res.status(400).json({
  message:"You have reached you gig Limit, try Optimizing your gig"
})
  }
    // Savimg it to the database
    

    console.log(newGig)
  } catch (error) {
    console.error("Error creating gig:", error);
    res.status(500).json({ error: "Failed to create gig" });
  }
});



// getting analysis path

router.get("/weekly", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; 

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const rawActivityData = await prisma.$queryRaw`
            SELECT
                DATE_TRUNC('day', "heartbeatTime") AS day,
                COUNT(id) AS heartbeat_count
            FROM
                "ActivityLog"
            WHERE
                "userId" = ${userId} AND
                "heartbeatTime" >= ${sevenDaysAgo}
            GROUP BY
                day
            ORDER BY
                day;
        `;

        const weeklyActivity = rawActivityData.map(row => {
            const count = Number(row.heartbeat_count);
            const totalSeconds = count * 30;
            const totalHours = parseFloat((totalSeconds / 3600).toFixed(2));

            return {
                name: new Date(row.day).toLocaleDateString('en-US', { weekday: 'short' }),
                hours: totalHours,
            };
        });
const totalHoursSum = weeklyActivity.reduce((sum, day) => sum + day.hours, 0);
const formattedTotalHours = parseFloat(totalHoursSum.toFixed(1)); 
     
        res.status(200).json({
    dailyData: weeklyActivity,
    totalHours: formattedTotalHours,
});
console.log(weeklyActivity)
    } catch (error) {
        console.error('Error fetching weekly activity:', error);
        res.status(500).json({ message: 'Internal server error while fetching activity data' });
    }
});




router.get("/verify-token", verifyToken, async   (req, res) => {
  const user = req.user.id;
  const selectUser = await prisma.user.findUnique({where:{id:user},
  select:{name:true, profileimg:true}
  })
  res.status(200).json({ message: "Token is valid", selectUser });  
}
);

router.get("/getgig", verifyToken, async (req, res)=>{
  const userId = req.user.id;     
try{
const gigs = await prisma.gig.findMany({
  where: { userId:userId }

});

  res.status(200).json({message: "Gigs fetched successfully", gigs });
  console.log("Gigs fetched successfully" )
  console.log(gigs)
}catch(error){
  console.error("Error fetching gigs:", error);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
})



// deletting gigs Routhe


router.post("/deletegigs", verifyToken, async (req, res) => {
  try {
    const { gigIds } = req.body;

    if (!gigIds || !Array.isArray(gigIds) || gigIds.length === 0) {
      return res.status(400).json({ message: "Gig IDs are required" });
    }

 
    const gigs = await prisma.gig.findMany({
      where: {
        id: { in: gigIds }
      }
    });

   
    if (gigs.length !== gigIds.length) {
      return res.status(404).json({ message: "Some gigs were not found" });
    }

  
    const unauthorized = gigs.some((gig) => gig.userId !== req.user.id);

    if (unauthorized) {
      return res.status(403).json({ message: "You cannot delete gigs that don't belong to you" });
    }

    // Delete all gigs
    await prisma.gig.deleteMany({
      where: { id: { in: gigIds } }
    });

    res.status(200).json({ message: "Gigs deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

// comfirming the number of gigs that the user has created
router.get("/useraccountgig", verifyToken, async (req, res)=>{
  try{
    const userId = req.user.id;
    const gigchecknumber = await prisma.gig.findMany({where:{userId:userId}})
    if(gigchecknumber.length >=4){
      return res.status(400).json({message: "Gig limit reached. You cannot create more gigs.", gigcount: gigchecknumber.length})
    }
    res.status(200).json({message: "You can create a new gig", gigcount: gigchecknumber.length})

  } catch(error){
    console.error("Error confirming gigs:", error);
    res.status(500).json({ error: "Failed to confirm gigs" });
  }
})
export default router;
