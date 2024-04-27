import Template from "../components/Template";
import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import Modal from "../components/Modal";
import Swal from "sweetalert2";

function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/product/list", config.headers())
        .then((res) => {
          setProducts(res.data.results);
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

  const clearForm = () => {
    setProduct({
      barcode: "",
      name: "",
      detail: "",
      cost: "",
      price: "",
    });
  };

  const handleClose = () => {
    const btns = document.getElementsByClassName("btn-close");
    for (let i = 0; i < btns.length; i++) {
      btns[i].click();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      let url = config.api_path + "/product/create";
      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }

      await axios
        .post(url, product, config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              text: "Save Product Successfully",
              icon: "success",
              timer: 2000,
            });

            fetchData();
            handleClose();
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

  const handleDelete = (item) => {
    Swal.fire({
      text: "Confirm to delete product",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await axios
            .delete(
              config.api_path + "/product/delete/" + item.id,
              config.headers()
            )
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({
                  text: "Delete Product Successfully",
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
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Product</div>
          </div>
          <div className="card-body">
            <button
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#modalProduct"
              onClick={clearForm}
            >
              <i className="fa fa-plus mr-1"></i> New Product
            </button>

            <table className="mt-3 table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Product</th>
                  <th>Detail</th>
                  <th className="text-right">Cost</th>
                  <th className="text-right">Price</th>
                  <th width="150px">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0
                  ? products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.barcode}</td>
                        <td>{product.name}</td>
                        <td>{product.detail}</td>
                        <td>
                          {parseInt(product.cost).toLocaleString("th-TH")}
                        </td>
                        <td>
                          {parseInt(product.price).toLocaleString("th-TH")}
                        </td>
                        <td>
                          <button
                            className="btn btn-info"
                            data-bs-toggle="modal"
                            data-bs-target="#modalProduct"
                            onClick={(e) => setProduct(product)}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            className="ml-2 btn btn-danger"
                            onClick={(e) => handleDelete(product)}
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

      <Modal id="modalProduct" title="Product" modalSize="modal-lg">
        <form onSubmit={handleSave}>
          <div className="row">
            <div className="mt-3 col-2">
              <label>Barcode</label>
              <input
                type="text"
                className="form-control"
                value={product.barcode}
                onChange={(e) =>
                  setProduct({ ...product, barcode: e.target.value })
                }
              />
            </div>
            <div className="mt-3 col-10">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="mt-3 col-2">
              <label>Cost</label>
              <input
                type="text"
                className="form-control"
                value={product.cost}
                onChange={(e) =>
                  setProduct({ ...product, cost: e.target.value })
                }
              />
            </div>
            <div className="mt-3 col-2">
              <label>Price</label>
              <input
                type="text"
                className="form-control"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>
            <div className="mt-3 col-8">
              <label>Detail</label>
              <input
                type="text"
                className="form-control"
                value={product.detail}
                onChange={(e) =>
                  setProduct({ ...product, detail: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary " onClick={handleSave}>
              <i class="fa fa-check mr-2"></i> Save Product
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Product;
