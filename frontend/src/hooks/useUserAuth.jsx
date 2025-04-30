import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosinstance"; // Correct default import
import { API_Path } from "../utils/apiPath";
 // Closing quote added


 export const useUserAuth = () => {
  console.log("🧠 useUserAuth called");

  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  console.log("🧩 user from context:", user);

  useEffect(() => {
    console.log("🔁 useEffect triggered");

    if (user) {
      console.log("✅ User already in context, skipping API call");
      return;
    }

    let isMounted = true;

    const fetchUserInfo = async () => {
      console.log("🚀 Fetching user info from API...");
      try {
        const response = await axiosInstance.get(API_Path.AUTH.GET_USER_INFO);
        console.log("✅ User fetched from API:", response.data);

        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error("❌ Error fetching user info:", error);

        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser, navigate]);
};
