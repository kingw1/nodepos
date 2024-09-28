import config from "../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import axios from "axios";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [memberName, setMemberName] = useState();

  const handleSignOut = () => {
    Swal.fire({
      text: "Confirm to sign out",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(config.token_name);
        navigate("/login");
      }
    });
  };

  const handleEditProfile = async () => {
    try {
      axios
        .get(config.api_path + "/member/info", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setMemberName(res.data.result.name);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        text: e.message,
        icon: "error",
      });
    }
  };

  const handleChangeProfile = async (e) => {
    e.preventDefault();

    try {
      await axios
        .put(
          config.api_path + "/member/change-profile",
          {
            name: memberName,
          },
          config.headers()
        )
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              text: "Update your profile successfully",
              icon: "info",
              timer: 2000,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            text: error.message,
            icon: "error",
          });
        });
    } catch (error) {
      Swal.fire({
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button
              className="nav-link"
              data-bs-toggle="modal"
              data-bs-target="#modalEditProfile"
              onClick={handleEditProfile}
            >
              <i className="fa fa-user me-1"></i>
              User
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-danger " onClick={handleSignOut}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
            </button>
          </li>
        </ul>
      </nav>

      <Modal id="modalEditProfile" title="Edit Profile">
        <form onSubmit={handleChangeProfile}>
          <div className="mt-3">
            <label>Shop</label>
            <input
              type="text"
              className="form-control"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleChangeProfile}>
              Confirm <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Navbar;
