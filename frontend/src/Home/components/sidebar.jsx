import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { IoSearch, IoArrowBack, IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/socketContext";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const {
    messages,
    setSelectedConversation,
  } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const nowOnline = chatUser.map((user) => user._id);

  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
    });

    return () => socket?.off("newMessage");
  }, [socket, messages]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);

      try {
        const chats = await axios.get(`/api/user/currentchats`);
        const data = chats.data;

        if (data.success === false) {
          setLoading(false);

          console.log(data.message);
        }

        setLoading(false);

        setChatUser(data);
      } catch (error) {
        setLoading(false);

        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);

      const data = search.data;

      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }

      setLoading(false);

      if (data.length === 0) {
        toast.info("User not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
  };

  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  const handleLogOut = async () => {
    const confLogOut = window.prompt("Type 'username' to Logout");
    if (confLogOut === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        toast.info(data.message);
        localStorage.removeItem("relay");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("Logout cancelled");
    }
  };

  return (
    <div className="h-full w-auto px-1">
      <div className="flex justify-between gap-2 mt-2">
        <form
          onSubmit={handleSearchSubmit}
          className="w-auto flex items-center justify-between bg-white rounded-full"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="px-4 w-auto bg-transparent outline-none rounded-full"
            placeholder="Search User"
          />
          <button className="btn btn-circle bg-cyan-700 hover:bg-gray-950">
            <IoSearch />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profileimage}
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer"
        />
      </div>
      <div className="divider divide-solid px-3"></div>
      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%]  scrollbar">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                      selectedUserId === user?._id ? "bg-cyan-500" : ""
                    }`}
                  >
                    <div
                      className={`avatar ${isOnline[index] ? "online" : ""}`}
                    >
                      <div className="w-12 h-12 rounded-full">
                        <img src={user.profileimage} alt="" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="font-bold text-gray-950">{user.username}</p>
                    </div>
                  </div>
                  <div className="divider divide-solid px-3 h-[1px]"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handleSearchBack}
              className="bg-white rounded-full px-2 py-1 self-center"
            >
              <IoArrowBack size={25} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <>
                  <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                    <h1>No chats available!</h1>
                    <h1>Search friends to chat</h1>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handleUserClick(user)}
                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                          selectedUserId === user?._id ? "bg-cyan-500" : ""
                        }`}
                      >
                        <div
                          className={`avatar ${
                            isOnline[index] ? "online" : ""
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full">
                            <img src={user.profileimage} alt="" />
                          </div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="font-bold text-gray-950">
                            {user.username}
                          </p>
                        </div>
                        <div>
                          { newMessageUsers.reciverId === authUser._id && newMessageUsers.senderId === user._id ?
                          <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">
                            +1
                          </div> : <></>
                          }
                        </div>
                      </div>
                      <div className="divider divide-solid px-3 h-[1px]"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handleLogOut}
              className="hover:bg-red-600 w-10 cursor-pointer hover:text-white rounded-lg"
            >
              <IoLogOutOutline size={25} />
            </button>
            <p className="text-sm py-1"> Logout</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
