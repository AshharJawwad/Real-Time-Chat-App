import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [inputData, setInputData] = useState({});

  const handleInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  const selectGender = (selectGender) => {
    setInputData((prev) => ({
      ...prev,
      gender: selectGender === inputData.gender ? "" : selectGender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (inputData.password !== inputData.confpassword.toLowerCase()) {
      setLoading(false);
      return toast.error("Password doesn't match");
    }

    try {
      const register = await axios.post("/api/auth/register", inputData);
      const data = register.data;

      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }

      toast.success(data?.message);

      localStorage.setItem("relay", JSON.stringify(data));

      setLoading(false);

      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Register <span className="text-gray-950">Anchors</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-black">
          <div className="mt-8">
            <label className="font-bold text-gray-950 text-xl label-text">
              Full Name:
            </label>
            <input
              type="text"
              id="fullname"
              onChange={handleInput}
              placeholder="Enter Full Name"
              required
              className="w-full input input-bordered h-10 border-none mt-1"
            />
          </div>
          <div className="mt-4">
            <label className="font-bold text-gray-950 text-xl label-text">
              Username:
            </label>
            <input
              type="text"
              id="username"
              onChange={handleInput}
              placeholder="Enter Username"
              required
              className="w-full input input-bordered h-10 border-none mt-1"
            />
          </div>
          <div className="mt-4">
            <label className="font-bold text-gray-950 text-xl label-text">
              Email:
            </label>
            <input
              type="email"
              id="email"
              onChange={handleInput}
              placeholder="Enter Email"
              required
              className="w-full input input-bordered h-10 border-none mt-1"
            />
          </div>
          <div className="mt-4">
            <label className="font-bold text-gray-950 text-xl label-text">
              Password:
            </label>
            <input
              type="password"
              id="password"
              onChange={handleInput}
              placeholder="Enter Password"
              required
              className="w-full input input-bordered h-10 border-none mt-1"
            />
          </div>
          <div className="mt-4">
            <label className="font-bold text-gray-950 text-xl label-text">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confpassword"
              onChange={handleInput}
              placeholder="Confirm Password"
              required
              className="w-full input input-bordered h-10 border-none mt-1"
            />
          </div>

          <div id="gender" className="flex mt-4 justify-around">
            <label className="cursor-pointer label flex gap-2">
              <span className="label-text font-semibold text-gray-950">
                Male
              </span>
              <input
                onChange={() => selectGender("male")}
                checked={inputData.gender === "male"}
                type="checkbox"
                className="checkbox checkbox-info"
              />
            </label>
            <label className="cursor-pointer label flex gap-2">
              <span className="label-text font-semibold text-gray-950">
                Female
              </span>
              <input
                onChange={() => selectGender("female")}
                checked={inputData.gender === "female"}
                type="checkbox"
                className="checkbox checkbox-info"
              />
            </label>
          </div>

          <button
            type="submit"
            className="bg-cyan-500 mt-6 p-2 rounded-lg font-bold text-white hover:bg-cyan-400"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
        <div className="pt-4">
          <p className="text-sm font-semibold text-gray-800">
            Have an account?
            <Link to={"/login"}>
              <span className="text-blue-950 font-bold underline cursor-pointer hover:text-cyan-800 ml-2">
                Login
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
