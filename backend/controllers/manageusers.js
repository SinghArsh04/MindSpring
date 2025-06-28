const User = require('../models/user');

const Profile = require('../models/profile');


const Course = require('../models/course')

const { deleteResourceFromCloudinary } = require('../utils/imageUploader');





exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserbyId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("additionalDetails")
      .populate("courses")
      .populate("courseProgress");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
          // extract user id
          const userId = req.params.id;
          // console.log('userId = ', userId)
  
          // validation
          const userDetails = await User.findById(userId);
          if (!userDetails) {
              return res.status(404).json({
                  success: false,
                  message: 'User not found'
              });
          }
  
          // delete user profile picture From Cloudinary
          if(userDetails.image){
            await deleteResourceFromCloudinary(userDetails.image);
          }
          
  
          // if any student delete their account && enrollded in any course then ,
          // student entrolled in particular course sholud be decreae by one
          // user - courses - studentsEnrolled
          const userEnrolledCoursesId = userDetails.courses
          console.log('userEnrolledCourses ids = ', userEnrolledCoursesId)
  
          for (const courseId of userEnrolledCoursesId) {
              await Course.findByIdAndUpdate(courseId, {
                  $pull: { studentsEnrolled: userId }
              })
          }
  
          // first - delete profie (profileDetails)
          await Profile.findByIdAndDelete(userDetails.additionalDetails);
  
          // second - delete account
          await User.findByIdAndDelete(userId);
  
  
          // sheduale this deleting account , crone job
  
          // return response
          res.status(200).json({
              success: true,
              message: 'Account deleted successfully'
          })
      }
      catch (error) {
          console.log('Error while updating profile');
          console.log(error);
          res.status(500).json({
              success: false,
              error: error.message,
              message: 'Error while deleting profile'
          })
      }
  }
  
  
  // ================ get details of user ================
  exports.getUserDetails = async (req, res) => {
      try {
          // extract userId
          const userId = req.user.id;
          console.log('id - ', userId);
  
          // get user details
          const userDetails = await User.findById(userId).populate('additionalDetails').exec();
  
          // return response
          res.status(200).json({
              success: true,
              data: userDetails,
              message: 'User data fetched successfully'
          })
      }
      catch (error) {
          console.log('Error while fetching user details');
          console.log(error);
          res.status(500).json({
              success: false,
              error: error.message,
              message: 'Error while fetching user details'
          })
      }
};