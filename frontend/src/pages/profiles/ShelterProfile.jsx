import "./account.css";
import "../PublicCSS/templatestyle.css";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/shelter_sidebar.jsx";
import { profileform } from "./shelter_subcomponents/shelterprofileform";
import { baseURL } from "../../urlConfig.js";

export function ShelterProfile() {
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
