import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { NotifBox } from "./notifbox";
import "./notif.css"
import { baseURL } from "../../../urlConfig";

export function NotifDropdown() {
  const [notifs, setNotifs] = useState({});
  const [next, setNext] = useState("");
  const [prev, setPrev] = useState("");
  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(false);
  var [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [detailsClosed, setDetailsClosed] = useState(true);

  const handleToggleDetails = () => {
    const detailsElement = document.getElementsByClassName("left-dropdown")[0];
    if (detailsElement) {
      if (detailsElement.open) {
        setDetailsClosed(true);
      } else {
        setDetailsClosed(false);
      }
    }
  };

  useEffect(() => {
    getNotifs();
  }, []);

  function setStuff(response) {
    setNotifs(response.data.results);
    if (!response.data.next) {
      setIsNext(false);
    } else {
      setIsNext(true);
      setNext(response.data.next);
    }
    if (!response.data.previous) {
      setIsPrev(false);
    } else {
      setIsPrev(true);
      setPrev(response.data.previous);
    }
  }

  const getNotifs = async() => {
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      `${baseURL}notifications/notifications/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).then((response) => {
        if (!response) {
          console.log("unauthorized");
          navigate("/login");
        } else {
          setStuff(response);
        }
    })
        .catch((error) => console.log(error));

  }

  const getNextNotifs = async () => {
    if (!isNext) {
      return null;
    }
    setPage((prevPage) => prevPage + 1);
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      next,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => console.log(error));
    if (!response) {
      console.log("unauthorized");
      navigate("/login");
    } else {
      setStuff(response);
    }
  };

  const getPrevNotifs = async () => {
    if (!isPrev) {
      return null;
    }
    setPage((prevPage) => prevPage - 1);
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      prev,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => console.log(error));
    if (!response) {
      console.log("unauthorized");
      navigate("/login");
    } else {
      setStuff(response);
    }
  };

  function createBoxes() {
    const boxes = [];
    for (let i = 0; i < notifs.length; i++) {
      boxes.push(<NotifBox key={notifs[i].id} {...notifs[i]} />);
    }
    return boxes;
  }

  function PageButtons() {
    const NextButton = <span className="page-button" onClick={getNextNotifs}>Next</span>
    const PrevButton = <span className="page-button" onClick={getPrevNotifs}>Prev</span>
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {PrevButton}
          <p style={{ flex: 1, textAlign: 'center' }}> Page {page} </p>
          {NextButton}
        </div>);

  }

  return (
      <details className={`left-dropdown ${detailsClosed ? 'closed' : ''}`}>
        <summary>
          <b className="dropdown-tag" onClick={handleToggleDetails}>Notifications</b>
        </summary>
        <div className="notif-spacer"></div>
        <div className="notif-holder">{createBoxes()}</div>
        {PageButtons()}
      </details>
  );
}
