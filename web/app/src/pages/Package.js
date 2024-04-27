import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import Modal from "../components/Modal";

function Package() {
  const [packages, setPackages] = useState([]);
  const [yourPackage, setYourPackage] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      axios
        .get(config.api_path + "/packages/list")
        .then((res) => {
          setPackages(res.data.results);
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      console.log(e.message);
    }
  };

  const choosePackage = (item) => {
    setYourPackage(item);
  };

  return (
    <>
      <div className="container">
        <div className="h2 mt-2 text-primary">NodePos</div>
        <div className="h5">Package for you</div>
        <div className="row">
          {packages.map((item) => (
            <div className="col-4" key={item.id}>
              <div className="card">
                <div className="card-body text-center ">
                  <div className="h4 text-success ">{item.name}</div>
                  <div className="h5">
                    {parseInt(item.bill_amount).toLocaleString("th-Th")} / Month
                  </div>
                  <div className="h5 text-secondary ">
                    ฿{parseInt(item.price).toLocaleString("th-Th")}
                  </div>
                  <div className="mt-3">
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#modalRegister"
                      onClick={(e) => choosePackage(item)}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal id="modalRegister" title="Register">
        <form>
          <div>
            <label>Package</label>
            <div className="alert alert-info">
              {yourPackage.name} Price: {yourPackage.price} Bill Amount:{" "}
              {yourPackage.bill_amount}
            </div>
          </div>
          <div className="mt-3">
            <label>Shop</label>
            <input type="text" className="form-control" />
          </div>
          <div className="mt-3">
            <label>Phone</label>
            <input type="text" className="form-control" />
          </div>
          <div className="mt-3">
            <button className="btn btn-primary">
              Confirm <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Package;
