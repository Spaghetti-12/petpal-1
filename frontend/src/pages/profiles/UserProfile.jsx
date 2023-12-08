import "./account.css";
import "../PublicCSS/templatestyle.css";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/user_sidebar.jsx";
import { profileform } from "./user_subcomponents/userprofileform";
import { baseURL } from "../../urlConfig.js";

export function UserProfile() {
  return (
    <div>
      {header()}
      {sidebar()}
      <div className="content-box">
        <h1>
          <b>Your account information</b>
        </h1>
        {profileform()}
      </div>
    </div>
  );
}
