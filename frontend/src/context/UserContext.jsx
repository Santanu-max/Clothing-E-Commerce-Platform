import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";

export const userDataContext = createContext();

function userContext({ children }) {
  const [userData, setUserData] = useState(null);

  const { serverUrl } = useContext(authDataContext);

  const getCurrentUser = async () => {
    try {
      const result = await axios.post(
       `${serverUrl}/api/user/getCurrentUser`,
        {},
    {
       withCredentials: true,
    }
);
      console.log("getCurrentUser response:", result.data);
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default userContext;