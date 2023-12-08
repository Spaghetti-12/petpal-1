import {useEffect, useState} from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../urlConfig";

export function NotifBox(notif){

    console.log(notif.status);

    const [status, setStatus] = useState(notif.status);
    const navigate = useNavigate();

    useEffect(() => {
        getNotif();
    })

    const getNotif = async() => {
        const token = localStorage.getItem("token");
        const response = await Axios.get(
            `${baseURL}notifications/notification/` + notif.pk.toString() + "/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          },
        ).then((response) => {
            console.log(response);
            if (!response) {
              console.log("unauthorized");
              navigate("/login");
            } else {
              if (status !== response.data.status) {
                setStatus(response.data.status);
              }
            }
        })
            .catch((error) => console.log(error));
    }

    const deleteNotif = async() => {
        const token = localStorage.getItem("token");
        const response = await Axios.delete(
            `${baseURL}notifications/deletion/` + notif.pk.toString() + "/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          },
        ).then((response) => {
            console.log(response);
            if (!response) {
              console.log("unauthorized");
              navigate("/login");
            } else {
              if (status !== response.data.status) {
                setStatus(response.data.status);
              }
            }
        })
            .catch((error) => console.log(error));
    }

    const clickRead = async() =>{
        if (status === 1) {
            const token = localStorage.getItem("token");
            const response = await Axios.put(
                `${baseURL}notifications/update/` + (notif.pk).toString() + "/",
                {status: 2},
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                },
            ).then((response) => {
                console.log(response);
                if (!response) {
                    console.log("unauthorized");
                    navigate("/login");
                } else {
                    setStatus(2);
                }
            })
                .catch((error) => console.log(error));
        }
        console.log("wow");
        console.log(notif);
        console.log(`/shelter/shelterview/${notif.url.charAt(notif.url.length - 2)}`);

        if (localStorage.getItem("userType") === "1") {
            if (notif.content.includes("application")) {
                navigate(`/user/application/view/${notif.url.charAt(notif.url.length - 2)}`)
            }
        }
        else {
            if (notif.content.includes("application")) {
                navigate(`/shelter/application/view/${notif.url.charAt(notif.url.length - 2)}`);
            }
            if (notif.content.includes("comment")) {
                navigate(`/shelter/shelterview/${notif.url.charAt(notif.url.length - 2)}`);
            }
        }
        deleteNotif();
    }

    return (
        <div onClick={clickRead} className={(status === 2) ? "notif-box-read" : "notif-box"}>
            <p>{notif.content}</p>
        </div>
    )
}