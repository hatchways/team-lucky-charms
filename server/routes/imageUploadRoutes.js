const express = require("express");
const router = express();
const uploadImages = require("../controllers/imageUploadController");

router.post("/imageUpload", uploadImages);

module.exports = router;
