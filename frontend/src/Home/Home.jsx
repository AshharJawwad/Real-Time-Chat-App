import { useAuth } from "../context/AuthContext";
import MessageContainer from "./components/MessageContainer";
import Sidebar from "./components/Sidebar";

const Home = () => {
  const { authUser } = useAuth();
  return (
    <div className="flex justify-between min-w-full md:min-w-[550px] md:max-w-[65%] px-2 h-[95%] md:h-full rounded-xl shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <div>
        <Sidebar />
      </div>
      <div>
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;