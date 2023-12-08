import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { header } from "../PublicComponents/header.jsx";
import { sidebar } from "../PublicComponents/user_sidebar.jsx";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import {InfoBox} from "./subcomponents/InfoBox";
import { CommentBox } from "./subcomponents/CommentBox";
import { baseURL } from "../../urlConfig.js";

export function UserShelterView() {
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [shelter, setShelter] = useState({});
  var [comments, setComments] = useState({});
  const navigate = useNavigate();
  var [page, setPage] = useState(1);
  var [next, setNext] = useState();
  var [prev, setPrev] = useState();

  useEffect(() => {
    getShelter();
    checkUserTypeAndNavigate();
  }, []);

  const checkUserTypeAndNavigate = () => {
    if (localStorage.getItem("userType") === "2") {
      navigate("/shelter/list");
    }
  };

  const getShelter = async () => {
    const token = localStorage.getItem("token");
    const response = await Axios.get(
      `${baseURL}accounts/shelter/shelter/` + id.toString() + "/",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => console.log(error));
    if (!response) {
      console.log("unauthorized");
      navigate("/shelter_not_found");
    } else {
      setShelter(response.data);
      // Get the comments
      const response_comments = await Axios.get(
        `${baseURL}comments/list/shelter/` + id.toString() + `/?ordering=-creation_time&page=` + page,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      ).catch((error) => {
        console.log(error);
      });
      if (!response_comments) {
        console.log("unauthorized");
        navigate("/shelter_not_found");
      } else {
        setComments(response_comments.data.results);
        setPrev(response_comments.data.previous);
        setNext(response_comments.data.next);
      }
    }
  };

  function createComments() {
    const boxes = [];
    for (let i = 0; i < comments.length; i++) {
      boxes.push(<CommentBox key={comments[i].id} {...comments[i]} />);
    }
    return boxes;
  }

  function prev_page(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (prev !== null) {
      setPage((prevPage) => prevPage - 1);
      getComments(prev, token);
    }
  }

  function next_page(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (next !== null) {
      setPage((prevPage) => prevPage + 1);
      getComments(next, token);
    }
  }

  const getComments = async (url, token) => {
    var response_comments_2 = await Axios.get(
      url,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      },
    ).catch((error) => {
      console.log(error);
    });
    if (!response_comments_2) {
      console.log("unauthorized");
      navigate("/shelter_not_found");
    } else {
      setComments(response_comments_2.data.results);
      setPrev(response_comments_2.data.previous);
      setNext(response_comments_2.data.next);
    }
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Axios.post(
      `${baseURL}comments/creation/shelter/` + id.toString() + "/",
      {
        content: inputs.commentContent
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    ).then((response) => {
      getComments(
        `${baseURL}comments/list/shelter/` + id.toString() + `/?ordering=-creation_time&page=` + page,
        localStorage.getItem("token")
      );
    }).catch((error) => {
      console.log(error.response.data);
    });
  }

  return (
    <div className={"outerbox"}>
      {header()}
      {sidebar()}
      <div className="content-box">
        {InfoBox(shelter)}
        <form
          style={{display: 'flex', alignItems: 'center'}}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            id="commentContent"
            name="commentContent"
            className="form-control"
            onChange={handleChange}
            style={{margin:0, flex: 1}}
          ></input>
          <input
            style={{margin:0}}
            type="submit"
            className="page-button"
            id="submit"
            value="Comment"
           />
        </form>
        {createComments()}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button style={{ margin: 0 }}
            type='button'
            onClick={(event) => prev_page(event)}
          >Previous</button>
          <p style={{ flex: 1, textAlign: 'center' }}>Page {page}</p>
          <button style={{ margin: 0 }}
            onClick={(event) => next_page(event)}
            type='button'
          >Next</button>
        </div>
      </div>
    </div>
  );
}
