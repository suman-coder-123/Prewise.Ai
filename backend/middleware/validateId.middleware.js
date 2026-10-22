import mongoose from "mongoose";

// Used with router.param("id", validateId) so malformed ids return 400
// instead of surfacing as a Mongoose CastError (500).
const validateId = (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }
  next();
};

export default validateId;
