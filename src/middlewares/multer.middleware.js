import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
     
      cb(null, file.originalname)
    }
  })

//   // File filter to allow only video files
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/mov'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only video files are allowed!'), false);
//   }
// }
  
 export  const upload = multer({ 
    storage,
    // fileFilter: fileFilter,
    // limits: { fileSize: 100 * 1024 * 1024 }, // Set file size limit to 100MB
})