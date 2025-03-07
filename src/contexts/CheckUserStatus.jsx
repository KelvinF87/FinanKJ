import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const CheckUserStatus = ({ userId, children }) => {
  const { checkUserActiveStatus, logOutUser, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserStatus = async () => {
      if (!userId) {
        console.error("userId is undefined");
        return;
      }

      try {
        const isActive = await checkUserActiveStatus(userId);
        if (!isActive) {
          logOutUser();
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking user active status:", error);
      }
    };

    if (!isLoading) {
      verifyUserStatus();
    }
  }, [checkUserActiveStatus, logOutUser, isLoading]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return <>{children}</>;
};

export default CheckUserStatus;
