import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "../account.css";
import { baseURL } from "../../../urlConfig";

export function profileform() {
  const [inputs, setInputs] = useState({});
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(null);
  const [password1error, setPassword1Error] = useState(null);
  const [password2error, setPassword2Error] = useState(null);
  const [addresserror, setAddressError] = useState(null);
  const [emailerror, setEmailError] = useState(null);
  const [missionstatementerror, setMissionStatementError] = useState(null);
  const [nameerror, setNameError] = useState(null);
  const [phonenumerror, setPhoneNumError] = useState(null);
  const navigate = useNavigate();

  // Authorization

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      `${baseURL}accounts/shelter/profile/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => console.log(error));
    console.log(response);
    if (!response) {
      console.log("unauthorized");
      navigate("/login");
    } else {
      setProfile(response.data.profile);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    Axios.put(
      `${baseURL}accounts/shelter/update/`,
      {
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
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    ).then((res) => {
      console.log(res);
      toggleEdit();
      getProfile();
    }).catch((error) => {
      console.log(error);
      setError("One or more fields are invalid, please fix this issue");
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
    getProfile();
    //Update placeholder text for fields here?
  };

  function toggleEdit() {
    const password = document.getElementById("password");
    const repeat_password = document.getElementById("repeat_password");
    const name = document.getElementById("name");
    const address = document.getElementById("address");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const mission_statement = document.getElementById("mission_statement");
    const submitButton = document.getElementById("submitButton");
    const editButton = document.getElementById("editButton");

    if (name.hasAttribute("disabled")) {
      password.removeAttribute("disabled");
      repeat_password.removeAttribute("disabled");
      name.removeAttribute("disabled");
      address.removeAttribute("disabled");
      email.removeAttribute("disabled");
      phone.removeAttribute("disabled");
      mission_statement.removeAttribute("disabled");
      submitButton.removeAttribute("disabled");
      editButton.innerHTML = "Cancel";
      name.value = profile.name;
      address.value = profile.address;
      email.value = profile.email;
      phone.value = profile.phoneNum;
      mission_statement.value = profile.mission_statement;
      name.placeholder = "";
      address.placeholder = "";
      email.placeholder = "";
      phone.placeholder = "";
      mission_statement.placeholder = "";
      inputs.name = profile.name;
      inputs.address = profile.address;
      inputs.email = profile.email;
      inputs.phone = profile.phoneNum;
      inputs.mission_statement = profile.mission_statement;
    } else {
      password.setAttribute("disabled", "disabled");
      repeat_password.setAttribute("disabled", "disabled");
      name.setAttribute("disabled", "disabled");
      address.setAttribute("disabled", "disabled");
      email.setAttribute("disabled", "disabled");
      phone.setAttribute("disabled", "disabled");
      mission_statement.setAttribute("disabled", "disabled");
      submitButton.setAttribute("disabled", "disabled");
      password.value = "";
      repeat_password.value = "";
      name.value = "";
      address.value = "";
      email.value = "";
      phone.value = "";
      mission_statement.value = "";
      editButton.innerHTML = "Edit";
      name.placeholder = profile.name;
      address.placeholder = profile.address;
      email.placeholder = profile.email;
      phone.placeholder = profile.phoneNum;
      mission_statement.placeholder = profile.mission_statement;
      setError(null);
      setPassword1Error(null);
      setPassword2Error(null);
      setNameError(null);
      setAddressError(null);
      setEmailError(null);
      setPhoneNumError(null);
      setMissionStatementError(null);
    }
  }

  return (
    <div>
      <form id="accountform" onSubmit={handleSubmit}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          className="form-control"
          name="password"
          disabled
          onChange={handleChange}
        ></input>
        {password1error && <p className="error-text">{password1error}</p>}

        <label htmlFor="confirmpassword">Confirm password:</label>
        <input
          type="password"
          id="repeat_password"
          className="form-control"
          name="repeat_password"
          disabled
          onChange={handleChange}
        ></input>
        {password2error && <p className="error-text">{password2error}</p>}

        <label htmlFor="name">Shelter name:</label>
        <input
          className="form-control"
          type="text"
          id="name"
          name="name"
          disabled
          required
          placeholder={profile.name}
          onChange={handleChange}
        ></input>
        {nameerror && <p className="error-text">{nameerror}</p>}

        <label htmlFor="address">Address:</label>
        <input
          className="form-control"
          type="text"
          id="address"
          name="address"
          disabled
          required
          placeholder={profile.address}
          onChange={handleChange}
        ></input>
        {addresserror && <p className="error-text">{addresserror}</p>}

        <label htmlFor="email">Email:</label>
        <input
          className="form-control"
          type="text"
          id="email"
          name="email"
          disabled
          required
          placeholder={profile.email}
          onChange={handleChange}
        ></input>
        {emailerror && <p className="error-text">{emailerror}</p>}

        <label htmlFor="phone">Phone number:</label>
        <input
          className="form-control"
          type="tel"
          id="phone"
          name="phone"
          placeholder={profile.phoneNum}
          disabled
          required
          onChange={handleChange}
        ></input>
        {phonenumerror && <p className="error-text">{phonenumerror}</p>}

        <label htmlFor="mission_statement">Mission statement:</label>
        <textarea
          className="form-control"
          type="text"
          id="mission_statement"
          name="mission_statement"
          placeholder={profile.mission_statement}
          disabled
          required
          onChange={handleChange}
        ></textarea>
        {missionstatementerror && <p className="error-text">{missionstatementerror}</p>}

        {error && <p className="error-text">{error}</p>}

        <button
          className="page-button"
          type="button"
          id="editButton"
          onClick={toggleEdit}
        >
          Edit
        </button>

        <button
          className="page-button"
          type="submit"
          id="submitButton"
          disabled
        >
          Submit
        </button>
      </form>
    </div>
  );
}
