const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../models/comment');

//IMAGE UPLOADER
const storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });
  const imageFilter = function (req, file, cb) {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  const upload = multer({ storage: storage, fileFilter: imageFilter})
  
  cloudinary.config({ 
    cloud_name: 'dumxfw6s6', 
    api_key: 772524293964862, 
    api_secret: 'Jg_RcHyalHfmPq1zFhH74UvNMSQ'
  });

  module.exports = upload;