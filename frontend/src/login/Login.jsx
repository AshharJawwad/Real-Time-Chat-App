import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const login = await axios.post("/api/auth/login", userInput);
      const data = login.data;

      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }

      toast.success(data.message);

      localStorage.setItem("relay", JSON.stringify(data));

      setLoading(false);

      navigate("/");
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
          Login <span className="text-gray-950">Anchors</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-black">
          <div className="mt-8">
            <label className="font-bold text-gray-950 text-xl label-text">
              Email:
            </label>
            <input
              type="email"
              id="email"
              onChange={handleInput}
              placeholder="Enter your Email"
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
              placeholder="Enter your Password"
              required
              className="w-full input input-bordered h-10 border-none mt-1"
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-500 mt-6 p-2 rounded-lg font-bold text-white hover:bg-cyan-400"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="pt-4">
          <p className="text-sm font-semibold text-gray-800">
            Don&apos;t have an account?
            <Link to={"/register"}>
              <span className="text-blue-950 font-bold underline cursor-pointer hover:text-cyan-800 ml-2">
                Register Now
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
