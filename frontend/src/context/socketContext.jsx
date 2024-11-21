import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocecketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, SetOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:3000/", {
        query: {
          userId: authUser?._id,
        },
      });
      socket.on("getOnlineUsers", (users) => {
        SetOnlineUser(users);
      });
      setSocket(socket);
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);
  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
