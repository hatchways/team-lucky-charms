import React, { useContext } from "react";
import { userState } from "../provider/UserContext";

const Profile = () => {
  const { state } = useContext(userState);
  return (
    <div>
      <h1>Profile is for : {state.user.email ? state.user.email : ""}</h1>
    </div>
  );
};

export default Profile;
