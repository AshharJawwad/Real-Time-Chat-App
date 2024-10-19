import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import webToken from "../utils/webToken.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profileimage } =
      req.body;
    const user = await User.findOne({ username, email });
    if (user)
      return res
        .status(500)
        .send({ success: false, message: "Username or Email already exists!" });
    const hashPassword = bcryptjs.hashSync(password, 10);
    const profileBoy =
      profileimage ||
      `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const profileGirl =
      profileimage ||
      `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profileimage: gender === "male" ? profileBoy : profileGirl,
    });

    if (newUser) {
      await newUser.save();
      webToken(newUser._id, res);
    } else {
      res.status(500).send({ success: false, message: "Invalid user data" });
    }

    res.status(201).send({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      profileimage: newUser.profileimage,
      email: newUser.email,
    });

    console.log(newUser);
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(500)
        .send({ success: false, message: "Email doesn't exist!" });

    const comparePass = bcryptjs.compareSync(password, user.password || "");

    if (!comparePass)
      return res
        .status(500)
        .send({ success: false, message: "Email or Password doesn't match" });

    webToken(user._id, res);

    res.status(200).send({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profileimage: user.profileimage,
      email: user.email,
      message: "Successfully Logged In",
    });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};

export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });

    res.status(200).send({ message: "User successfully loggedout" });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};
