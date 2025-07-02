const Category = require('../models/category')

// get Random Integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// ================ create Category ================
exports.createCategory = async (req, res) => {
    try {
        // extract data
        const { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const categoryDetails = await Category.create({
            name: name, description: description
        });

        res.status(200).json({
            success: true,
            message: 'Category created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Category',
            error: error.message
        })
    }
}


// ================ get All Category ================
exports.showAllCategories = async (req, res) => {
    try {
        // get all category from DB
        const allCategories = await Category.find({}, { name: true, description: true });

        // return response
        res.status(200).json({
            success: true,
            data: allCategories,
            message: 'All allCategories fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching all allCategories');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all allCategories'
        })
    }
}



// ================ Get Category Page Details ================
// controllers/category.js

// helper
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.getCategoryPageDetails = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId query param is required",
      });
    }

    // 1) Selected category + its published courses
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No courses found for the selected category.",
      });
    }

    // 2) Pick a different category at random (if any exist)
    const otherCats = await Category.find({ _id: { $ne: categoryId } });
    let differentCategory = null;

    if (otherCats.length > 0) {
      const randomCat = otherCats[getRandomInt(otherCats.length)];
      differentCategory = await Category.findById(randomCat._id)
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec();
    }

    // 3) Top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: { path: "instructor" },
      })
      .exec();

    const allCourses = allCategories.flatMap((cat) => cat.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error("Error in getCategoryPageDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.categoryDetailsbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate({
        path: "courses",
        match: { status: "Published" }, // optional
        populate: "ratingAndReviews",   // optional
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: err.message,
    });
  }
};
