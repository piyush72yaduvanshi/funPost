import { prisma } from "./config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashpassword = async (password) => {
  return await bcrypt.hashSync(password, 10);
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userExist) {
      return res.status(400).json({
        message: "User Already Exist",
        status: false,
      });
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: await hashpassword(password),
      },
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        posts: true,
      },
    });
    const totalPosts = user.posts.length;
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secret",
      {
        expiresIn: "1d",
      },
      { algorithm: "RS256" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: user,
      totalPosts: totalPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
  });
};

export const getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decode = jwt.verify(token, "secret", { algorithm: "RS256" });
    const user = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
      include: {
        posts: true,
      },
    });
    const totalPosts = user.posts.length;
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "Profile fetched successfully",
      user: user,
      totalPosts: totalPosts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching profile",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  const token = req.cookies.token;
  const { name, password } = req.body;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const decode = jwt.verify(token, "secret", { algorithm: "RS256" });

  try {
    const user = await prisma.user.update({
      where: {
        id: decode.id,
      },
      data: {
        name: name,
        password: await hashpassword(password),
      },
    });
    res.status(200).json({
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while updating profile",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  const token = req.cookies.token;
  const { oldPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized, login first",
    });
  }

  const decode = jwt.verify(token, "secret", { algorithm: "RS256" });

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await hashpassword(newPassword),
      },
    });

    res.status(200).json({
      message: "Password changed successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while changing password",
      error: error.message,
    });
  }
};
