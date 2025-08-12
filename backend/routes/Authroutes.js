const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getuserInfo,
} = require("../controllers/authcontroller");

const upload = require("../middleware/uploadmiddleware"); // ✅ Make sure this path is correct

const router = express.Router();

// ✅ Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getuser", protect, getuserInfo);

// ✅ Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
