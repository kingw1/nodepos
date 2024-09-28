import { useEffect, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import Modal from "../components/Modal";

function Sale() {
  const [products, setProducts] = useState([]);
  const [billSale, setBillSale] = useState({});
  const [currentBill, setCurrentBill] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [item, setItem] = useState({});

  useEffect(() => {
    fetchData();
    openBill();
    fetchBillSaleDetail();
  }, []);

  const fetchBillSaleDetail = async () => {
    try {
      await axios
        .get(config.api_path + "/billSale/currentBillInfo", config.headers())
        .then((res) => {
          setCurrentBill(res.data.results);
          sumTotalPrice(res.data.results.billSaleDetails);
        });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const openBill = async () => {
    try {
      await axios
        .get(config.api_path + "/billSale/openBill", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setBillSale(res.data.result);
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

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/product/listForSale", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setProducts(res.data.results);
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

  const handleSave = async (item) => {
    try {
      await axios
        .post(config.api_path + "/billSale/sale", item, config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            fetchBillSaleDetail();
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const sumTotalPrice = (billSaleDetails) => {
    let sum = 0;
    for (let i = 0; i < billSaleDetails.length; i++) {
      const item = billSaleDetails[i];
      const qty = parseInt(item.qty);
      const price = parseInt(item.price);
      sum += qty * price;
    }

    setTotalPrice(sum);
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Delete Item",
      text: "Confirm to delete item",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios
          .delete(
            config.api_path + "/billSale/deleteItem/" + item.id,
            config.headers()
          )
          .then((res) => {
            if (res.data.message === "success") {
              fetchBillSaleDetail();
            }
          });
      }
    });
  };

  const handleUpdateQty = async () => {
    try {
      axios
        .post(config.api_path + "/billSale/updateQty", item, config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            fetchBillSaleDetail();
            handleClose();
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

  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header">
            <div className="card-title w-100">
              <div className="float-start">POS</div>
              <div className="float-end">
                <button className="btn btn-success">
                  <i className="fa fa-check me-2"></i>
                  Check Bill
                </button>
                <button className="btn btn-info ms-2">
                  <i className="fa fa-file me-2"></i>
                  Today Bill
                </button>
                <button className="btn btn-info ms-2">
                  <i className="fa fa-file me-2"></i>
                  Latest Bill
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-9">
                <div className="row">
                  {products.length > 0 &&
                    products.map((item) => (
                      <div
                        className="col-3"
                        key={item.id}
                        onClick={(e) => handleSave(item)}
                      >
                        <div className="card">
                          <img
                            src={
                              config.api_path +
                              "/uploads/" +
                              item.productImages[0].imageName
                            }
                            alt={item.productImages[0].imageName}
                            className="card-img-top"
                            width="100px"
                            height="100px"
                          />
                          <div className="card-body text-center">
                            <div className="text-primary">{item.name}</div>
                            <div>
                              {parseInt(item.price).toLocaleString("th-TH")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="col-3">
                <div
                  className="h1 ps-5 pe-3 text-end pt-3 pb-3"
                  style={{ color: "limegreen", backgroundColor: "black" }}
                >
                  {totalPrice.toLocaleString("th-TH")}
                </div>

                {currentBill !== null &&
                  currentBill.billSaleDetails !== undefined &&
                  currentBill.billSaleDetails.length > 0 &&
                  currentBill.billSaleDetails.map((item) => (
                    <div className="card" key={item.id}>
                      <div className="card-body">
                        <div>{item.product.name}</div>
                        <div>
                          {item.qty} x{" "}
                          {parseInt(item.price).toLocaleString("th-TH")} ={" "}
                          {(item.qty * item.price).toLocaleString("th-TH")}
                        </div>
                        <div className="text-center">
                          <button
                            className="btn btn-primary me-2"
                            onClick={(e) => setItem(item)}
                            data-bs-toggle="modal"
                            data-bs-target="#modalQty"
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => handleDelete(item)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* <div className="input-group mt-3">
              <span className="input-group-text">Barcode</span>
              <input type="text" className="form-control" />
              <button className="btn btn-primary">
                <i className="fa fa-search me-2"></i> Save
              </button>
            </div> */}

            {/* <table className="table table-bordered table-striped mt-3">
              <thead>
                <tr>
                  <th className="bg-secondary">#</th>
                  <th className="bg-secondary">Barcode</th>
                  <th className="bg-secondary">Product</th>
                  <th className="bg-secondary">Price</th>
                  <th className="bg-secondary">Qty</th>
                  <th className="bg-secondary">#</th>
                </tr>
              </thead>
            </table> */}
          </div>
        </div>
      </Template>

      <Modal id="modalQty" title="Edit Qty">
        <div>
          <label>Qty</label>
          <input
            type="text"
            className="form-control"
            value={item.qty}
            onChange={(e) => setItem({ ...item, qty: e.target.value })}
          />
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleUpdateQty}>
              <i className="fa fa-check me-2"></i>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Sale;
