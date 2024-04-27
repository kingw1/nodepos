import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState();
  const [pass, setPass] = useState();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const payload = {
        phone: phone,
        pass: pass,
      };

      await axios
        .post(config.api_path + "/member/signin", payload)
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              text: "Sign In Successfully",
              icon: "success",
              timer: 2000,
            });

            localStorage.setItem(config.token_name, res.data.token);
            navigate("/home");
          } else {
            Swal.fire({
              text: res.data.message,
              icon: "error",
            });
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

  return (
    <>
      <div className="container">
        <div className="h3 text-center mt-5">Login to POS</div>
        <div className="card mt-5">
          <div className="card-body">
            <div>
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={handleSignIn}>
              <i className="fa fa-check"></i>
              <span className="pl-2">Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
