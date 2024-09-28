import Template from "../components/Template";
import { useEffect, useState } from "react";
import config from "../config";
import axios from "axios";
import Modal from "../components/Modal";
import Swal from "sweetalert2";

function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState({});
  const [productImage, setProductImage] = useState({});
  const [productImages, setProductImages] = useState({});

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

  const handleChangeFile = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    Swal.fire({
      text: "Confirm to upload image",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const _config = {
            headers: {
              Authorization:
                "Bearer " + localStorage.getItem(config.token_name),
              "Content-Type": "multipart/form-data",
            },
          };
          const formData = new FormData();
          formData.append("productImage", productImage);
          formData.append("productImageName", productImage.name);
          formData.append("productId", product.id);

          await axios
            .post(config.api_path + "/productImage/upload", formData, _config)
            .then((res) => {
              if (res.data.message === "success") {
                Swal.fire({
                  text: "Upload product image successfully",
                  icon: "success",
                  timer: 2000,
                });

                fetchDataProductImage(product);
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
      }
    });
  };

  const fetchDataProductImage = async (item) => {
    try {
      await axios
        .get(
          config.api_path + "/productImage/list/" + item.id,
          config.headers()
        )
        .then((res) => {
          if (res.data.message === "success") {
            setProductImages(res.data.results);
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

  const handleChooseProduct = (item) => {
    setProduct(item);
    fetchDataProductImage(item);
  };

  const handleChooseMainImage = (item) => {
    Swal.fire({
      text: "Confirm to choose main image",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const url =
            config.api_path +
            "/productImage/choose-main-image/" +
            item.id +
            "/" +
            item.productId;
          await axios
            .get(url, config.headers())
            .then((res) => {
              if (res.data.message === "success") {
                fetchDataProductImage({
                  id: item.productId,
                });
                Swal.fire({
                  text: "Choose main image successfully",
                  icon: "success",
                  timer: 2000,
                });
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

  const handleImageDelete = (item) => {
    Swal.fire({
      text: "Confirm to delete image",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const url = config.api_path + "/productImage/delete/" + item.id;
          await axios
            .delete(url, config.headers())
            .then((res) => {
              if (res.data.message === "success") {
                fetchDataProductImage({
                  id: item.productId,
                });

                Swal.fire({
                  text: "Delete image successfully",
                  icon: "success",
                  timer: 2000,
                });
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
                  <th width="180px">Action</th>
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
                            className="btn btn-default mr-1"
                            data-bs-toggle="modal"
                            data-bs-target="#modalProductImage"
                            onClick={(e) => handleChooseProduct(product)}
                          >
                            <i className="fa fa-image"></i>
                          </button>
                          <button
                            className="btn btn-info mr-1"
                            data-bs-toggle="modal"
                            data-bs-target="#modalProduct"
                            onClick={(e) => setProduct(product)}
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            className="btn btn-danger"
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
              <i className="fa fa-check mr-2"></i> Save Product
            </button>
          </div>
        </form>
      </Modal>
      <Modal id="modalProductImage" title="Product Image" modalSize="modal-lg">
        <div className="row">
          <div className="col-4">
            <label>Barcode</label>
            <input
              type="text"
              value={product.barcode}
              className="form-control"
              disabled
            />
          </div>
          <div className="col-8">
            <label>Product</label>
            <input
              type="text"
              value={product.name}
              className="form-control"
              disabled
            />
          </div>
          <div className="col-12 mt-3">
            <label>Detail</label>
            <input
              type="text"
              value={product.detail}
              className="form-control"
              disabled
            />
          </div>

          <div className="col-12 mt-3">
            <label>Browse image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleChangeFile}
              accept="image/png, image/jpeg"
            />
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary " onClick={handleUpload}>
            <i className="fa fa-check mr-2"></i>
            Upload Image
          </button>
        </div>

        <div className="mt-3 h5">Images</div>
        <div className="row">
          {productImages.length > 0
            ? productImages.map((item) => (
                <div className="col-3 text-center " key={item.id}>
                  <div>
                    <img
                      src={config.api_path + "/uploads/" + item.imageName}
                      alt={item.imageName}
                      width="100%"
                    />
                  </div>

                  {item.isMain ? (
                    <label className="btn btn-success btn-sm btn-block active">
                      <i className="fa fa-check-circle text-white mr-2"></i>
                      Main
                    </label>
                  ) : (
                    <div>
                      <button
                        className="btn btn-default btn-sm btn-block"
                        onClick={(e) => handleChooseMainImage(item)}
                      >
                        Main
                      </button>
                      <button
                        className="btn btn-danger btn-sm btn-block"
                        onClick={(e) => handleImageDelete(item)}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))
            : "No image"}
        </div>
      </Modal>
    </>
  );
}

export default Product;
