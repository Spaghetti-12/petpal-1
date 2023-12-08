import { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../urlConfig";

export function form() {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);
  const [usernameerror, setUsernameError] = useState(null);
  const [password1error, setPassword1Error] = useState(null);
  const [password2error, setPassword2Error] = useState(null);
  const [addresserror, setAddressError] = useState(null);
  const [emailerror, setEmailError] = useState(null);
  const [missionstatementerror, setMissionStatementError] = useState(null);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    Axios.post(
      `${baseURL}accounts/shelter/registration/`,
      {
        username: inputs.username,
        password: inputs.password,
        repeat_password: inputs.repeat_password,
        shelterProfile: {
          name: inputs.name,
          email: inputs.email,
          phoneNum: inputs.phoneNum,
          address: inputs.address,
          mission_statement: inputs.mission_statement,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT",
        },
      },
    ).then((response) => {
      success();
    }).catch((error) => {
      console.log(error.response.data);
      setError("One or more fields are invalid, please fix this issue");
      setUsernameError(error.response.data.username || null);
      setPassword1Error(error.response.data.password || null);
      setPassword2Error(error.response.data.repeat_password || null);
      if (error.response.data.shelterProfile) {
          setAddressError(error.response.data.shelterProfile.address || null);
          setEmailError(error.response.data.shelterProfile.email || null);
          setMissionStatementError(error.response.data.shelterProfile.mission_statement || null);
          setNameError(error.response.data.shelterProfile.name || null);
          setPhoneNumError(error.response.data.shelterProfile.phoneNum || null);
      }

      if (error.response.data && error.response.data.non_field_errors) {
          setPassword1Error(error.response.data.non_field_errors[0]);
      } else {
          setPassword1Error(null);
      }
    });
  };

  return (
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

      <label htmlFor="confirmpassword">Confirm password:</label>
      <input
        type="password"
        id="confirmpassword"
        className="form-control"
        required
        name="repeat_password"
        value={inputs.repeat_password || ""}
        onChange={handleChange}
      ></input>
        {password2error && <p className="error-text">{password2error}</p>}

      <h1>Tell us about your shelter:</h1>

      <label htmlFor="sheltername">Shelter name:</label>
      <input
        type="text"
        id="sheltername"
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

      <label htmlFor="phonenumber">Phone number:</label>
      <input
        type="tel"
        id="phonenumber"
        className="form-control"
        required
        name="phoneNum"
        value={inputs.phoneNum || ""}
        onChange={handleChange}
      ></input>
        {phonenumerror && <p className="error-text">{phonenumerror}</p>}

      <label htmlFor="missionstatement">Mission statement:</label>
      <textarea
        id="missionstatement"
        className="form-control"
        rows="5"
        required
        name="mission_statement"
        value={inputs.mission_statement || ""}
        onChange={handleChange}
      ></textarea>
        {missionstatementerror && <p className="error-text">{missionstatementerror}</p>}

        {error && <p className="error-text">{error}</p>}

      <input
        type="submit"
        className="page-button"
        id="submit"
        value="Create Account"
      ></input>
    </form>
  );
}
