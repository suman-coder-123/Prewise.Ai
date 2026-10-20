import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide fullName, email and password",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // 5. Send response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existsUser = await User.findOne({ email });

    if (!existsUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      existsUser.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: existsUser._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: existsUser._id,
        fullName: existsUser.fullName,
        email: existsUser.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updatePreferences = async (req, res) => {
    try {
        const { preferredCity, workType, willingToRelocate } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { preferences: { preferredCity, workType, willingToRelocate } },
            { returnDocument: "after" }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getCurrentUser = async (req , res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if(!user) {
            return res.status(404).json({
                success:false,
                message : "user not found",
            });
        }

        return res.status(200).json({
            success:true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};