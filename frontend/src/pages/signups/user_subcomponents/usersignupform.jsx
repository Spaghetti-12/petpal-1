import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../signupstyle.css";
import { baseURL } from "../../../urlConfig";

export function form() {
  var [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);
  const [usernameerror, setUsernameError] = useState(null);
  const [password1error, setPassword1Error] = useState(null);
  const [password2error, setPassword2Error] = useState(null);
  const [addresserror, setAddressError] = useState(null);
  const [emailerror, setEmailError] = useState(null);
  const [imageerror, setImageError] = useState(null);
  const [nameerror, setNameError] = useState(null);
  const [phonenumerror, setPhoneNumError] = useState(null);
  const navigate = useNavigate();

  function success() {
    navigate("/login");
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChangeFile = (event) => {
    console.log(event.target.files);
    setInputs((values) => ({ ...values, profilePic: event.target.files[0] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', inputs.username);
    formData.append('password', inputs.password);
    formData.append('repeat_password', inputs.repeat_password);

    // Append user profile fields to a nested object
    formData.append('userProfile.name', inputs.name);
    formData.append('userProfile.email', inputs.email);
    formData.append('userProfile.phoneNum', inputs.phoneNum);
    formData.append('userProfile.address', inputs.address);
    formData.append('userProfile.profilePic', inputs.profilePic);
    Axios.post(
      `${baseURL}accounts/user/registration/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "JWT",
        },
      },
    )
    .then((response) => {
      success();
    }).catch((error) => {
      console.log(error);
      setError("One or more fields are invalid, please fix this issue");
      setUsernameError(error.response.data.username || null);
      setPassword1Error(error.response.data.password || null);
      setPassword2Error(error.response.data.repeat_password || null);
      if (error.response.data.userProfile) {
          setAddressError(error.response.data.userProfile.address || null);
          setEmailError(error.response.data.userProfile.email || null);
          setImageError(error.response.data.userProfile.profilePic || null);
          setNameError(error.response.data.userProfile.name || null);
          setPhoneNumError(error.response.data.userProfile.phoneNum || null);
      }

      if (error.response.data && error.response.data.non_field_errors) {
          setPassword1Error(error.response.data.non_field_errors[0]);
      } else {
          setPassword1Error(null);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          className="form-control"
          required
          name="username"
          value={inputs.username || ""}
          onChange={handleChange}
        ></input>
        {usernameerror && <p className="error-text">{usernameerror}</p>}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className="form-control"
          required
          name="password"
          value={inputs.password || ""}
          onChange={handleChange}
        ></input>
        {password1error && <p className="error-text">{password1error}</p>}

        <label htmlFor="repeat_password">Confirm password:</label>
        <input
          type="password"
          id="repeat_password"
          className="form-control"
          required
          name="repeat_password"
          value={inputs.repeat_password || ""}
          onChange={handleChange}
        ></input>
        {password2error && <p className="error-text">{password2error}</p>}

        <h1>Tell us about yourself:</h1>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          className="form-control"
          required
          name="name"
          value={inputs.name || ""}
          onChange={handleChange}
        ></input>
        {nameerror && <p className="error-text">{nameerror}</p>}

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          className="form-control"
          required
          name="address"
          value={inputs.address || ""}
          onChange={handleChange}
        ></input>
        {addresserror && <p className="error-text">{addresserror}</p>}

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          className="form-control"
          required
          name="email"
          value={inputs.email || ""}
          onChange={handleChange}
        ></input>
        {emailerror && <p className="error-text">{emailerror}</p>}

        <label htmlFor="phoneNum">Phone number:</label>
        <input
          type="tel"
          id="phoneNum"
          className="form-control"
          required
          name="phoneNum"
          value={inputs.phoneNum || ""}
          onChange={handleChange}
        ></input>
        {phonenumerror && <p className="error-text">{phonenumerror}</p>}

        <label htmlFor="profilePic">Upload a picture:</label>
        <input
          type="file"
          id="profilePic"
          required
          name="profilePic"
          onChange={handleChangeFile}
        ></input>
        {imageerror && <p className="error-text">{imageerror}</p>}

        {error && <p className="error-text">{error}</p>}

        <input
          type="submit"
          className="page-button"
          id="submit"
          value="Create Account"
        ></input>
      </form>
    </div>
  );
}
