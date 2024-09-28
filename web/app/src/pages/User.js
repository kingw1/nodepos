import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";

function User() {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/user/list", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setUsers(res.data.results);
          }
        });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const clearForm = () => {
    setUser({
      id: undefined,
      name: "",
      usr: "",
      level: "",
    });
    setPassword("");
    setConfirmPassword("");
  };

  const changePassword = (item) => {
    setPassword(item);
    comparePassword();
  };

  const changeConfirmPassword = (item) => {
    setConfirmPassword(item);
    comparePassword();
  };

  const comparePassword = () => {
    if (password.length > 0 && confirmPassword.length > 0) {
      if (password != confirmPassword) {
        Swal.fire({
          title: "Checking Password",
          text: "Password not match",
          icon: "error",
        });
      } else {
        setUser({
          ...user,
          pwd: password,
        });
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      let url = config.api_path + "/user/create";
      if (user.id !== undefined) {
        url = config.api_path + "/user/edit";
      }

      await axios
        .post(url, user, config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "Save",
              text: "Save Completed",
              icon: "success",
              timer: 2000,
            });

            handleClose();
            fetchData();
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleClose = () => {
    const btns = document.getElementsByClassName("btn-close");
    for (let i = 0; i < btns.length; i++) {
      btns[i].click();
    }
  };

  const handleDelete = (user) => {
    try {
      Swal.fire({
        title: "Confirm Delete",
        text: "Confirm to delete user",
        icon: "question",
        showConfirmButton: true,
        showCancelButton: true,
      }).then(async (res) => {
        if (res.isConfirmed) {
          await axios
            .delete(
              config.api_path + "/user/delete/" + user.id,
              config.headers()
            )
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({
                  title: "Delete Data",
                  text: "delete user successfully",
                  icon: "success",
                  timer: 2000,
                });

                fetchData();
              }
            })
            .catch((error) => {
              Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
              });
            });
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header">
            <div className="card-title">User</div>
          </div>
          <div className="card-body">
            <button
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#modalUser"
              onClick={clearForm}
            >
              <i className="fa fa-plus mr-1"></i> New User
            </button>

            <table className="mt-3 table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>User</th>
                  <th>Level</th>
                  <th width="180px">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0
                  ? users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.usr}</td>
                        <td>{user.level}</td>
                        <td>
                          <button
                            className="btn btn-info mr-1"
                            data-bs-toggle="modal"
                            data-bs-target="#modalUser"
                            onClick={(e) => setUser(user)}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => handleDelete(user)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalUser" title="User" modalSize="modal-lg">
        <form onSubmit={handleSave}>
          <div className="row">
            <div className="mt-3">
              <label>Name</label>
              <input
                type="text"
                value={user.name}
                className="form-control"
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className="mt-3">
              <label>Username</label>
              <input
                type="text"
                value={user.usr}
                className="form-control"
                onChange={(e) => setUser({ ...user, usr: e.target.value })}
              />
            </div>
            <div className="mt-3">
              <label>Password</label>
              <input
                type="password"
                value={password}
                className="form-control"
                onBlur={(e) => changePassword(e.target.value)}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                className="form-control"
                onBlur={(e) => changeConfirmPassword(e.target.value)}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label>Level</label>
              <select
                value={user.level}
                className="form-control"
                onChange={(e) => setUser({ ...user, level: e.target.value })}
              >
                <option value="">Select</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleSave}>
              <i className="fa fa-check mr-2"></i> Save User
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default User;
