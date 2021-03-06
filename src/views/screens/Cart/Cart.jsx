import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import { Table, Alert } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import swal from "sweetalert";

class Cart extends React.Component {
  state = {
    cartData: [],
    kondisiCheckout: false,
    totalPrice: 0,
    checkoutItems: [],
    createForm: {
      ongkir: 100000,
    },
  };

  getCartData = () => {
    let subTotal = 0
    let HargaTotal= 0
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        console.log(res.data);
        this.setState({ cartData: res.data });
        this.state.cartData.map((val) => {
          subTotal += val.product.price * val.quantity
        })
        HargaTotal = subTotal+ (this.state.createForm.ongkir*1)
        this.setState({ totalPrice: HargaTotal})
        this.getCartData()
      })
      .catch((err) => {
        console.log(err);
      });
  };


  checkboxHandler = (e, idx) => {
    const { checked } = e.target

    if (checked) {
      this.setState({ checkoutItems: [...this.state.checkoutItems, idx] })
    } else {
      this.setState({
        checkoutItems: [
          ...this.state.checkoutItems.filter((val) => val !== idx)
        ]
      })
    }
  }


  renderCartData = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val;
      const { productName, image, price } = product;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
          </td>
          <td>{quantity}</td>
          <td>
            {" "}
            <img
              src={image}
              alt=""
              style={{ width: "100px", height: "200px", objectFit: "contain" }}
            />{" "}
          </td>
          <td>
            <ButtonUI
              type="outlined"
              onClick={() => this.deleteCartHandler(id)}
            >
              Delete Item
              </ButtonUI>
          </td>
          <td>
            <input type="checkbox" className="form-check" onChange={(e) => this.checkboxHandler(e, idx)} />
          </td>
        </tr>
      );
    });
  };

  deleteCartHandler = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.getCartData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  rendercheckOutHandler = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val;
      const { productName, image, price } = product;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
          </td>
          <td>{quantity}</td>
          <td>
            {" "}
            <img
              src={image}
              alt=""
              style={{ width: "100px", height: "200px", objectFit: "contain" }}
            />{" "}
          </td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price * quantity)}
          </td>
        </tr>
      )
    });
  }
  btnCheckout = () => {
    this.setState({
      kondisiCheckout: true
    })
  }
  inputHandler = (e, field, form) => {
    const { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    })
  }

  getTime = () => {
    let dateNow = new Date()
    let time = dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds();
    return dateNow.toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) + "-" + time
  }


  confirmCheckOut = () => {
    const notaTransaksi = {
      username: this.props.user.username,
      userId: this.props.user.id,
      totalPrice: this.state.totalPrice,
      status: "pending",
      // items:
      //   this.state.cartData.map(val => {
      //     return { ...val.product, quantity: val.quantity }
      //   }),
      tanggalBelanja: this.getTime(),
      tanggalSelesai: "",
    }

    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product"
      }
    })
      .then((res) => {
        res.data.map(val => {
          Axios.delete(`${API_URL}/carts/${val.id}`)
            .then((res) => {
              swal("Mantap Gan!", "Terima kasih Gan", "success")
              console.log(res.data)
              this.getCartData()
            })
            .catch((err) => {
              console.log(err);
            })
        })
        Axios.post(`${API_URL}/transactions`, notaTransaksi)
          .then(res => {
            this.state.cartData.map(val => {
              Axios.post(`${API_URL}/transactions_details`, {
                productId: val.product.id,
                transactionId: res.data.id,
                price: val.product.price,
                totalHarga: val.product.price * val.quantity,
                quantity: val.quantity
              })
                .then((res) => {
                  console.log(res)
                })
                .catch((err) => {
                  console.log(err)
                })
            })
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidMount() {
    this.getCartData();
  }

  render() {
    return (
      <div className="container py-4">
        {this.state.cartData.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Action</th>
                  <th><input type="checkbox" className="form-check" /></th>
                </tr>
              </thead>
              <tbody>{this.renderCartData()}</tbody>
            </Table>
            <div className="d-flex justify-content-center">
              <ButtonUI style={{ backgroundColor: "red" }} onClick=
                {() => this.btnCheckout()}
                type="contained">CheckOut</ButtonUI>
              <ButtonUI className="ml-2" onClick={() => alert(this.state.checkoutItems)}> checkBox</ButtonUI>
            </div>
            {
              this.state.kondisiCheckout ? (
                <div className="py-4">
                  <Table>
                    <thead>
                      <th>No</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Image</th>
                      <th>Total</th>
                    </thead>
                    <tbody>
                      {this.rendercheckOutHandler()}
                    </tbody>
                  </Table>
                  <h6 className="d-flex flex-row">Total price :{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(this.state.totalPrice)}
                  </h6>
                  <center>
                    <div className="d-flex flex-row">
                      <h3>durasi pengiriman</h3>
                      <select
                        value={this.state.createForm.ongkir}
                        className="custom-text-input h-100 pl-3"
                        onChange={(e) => this.inputHandler(e, "ongkir", "createForm")}
                      >
                        <option value={100000} selected>instant</option>
                        <option value={50000}>same day</option>
                        <option value={20000}>express</option>
                        <option value={0}>economy</option>
                      </select>
                    </div>
                    <ButtonUI onClick={this.confirmCheckOut}>Confirm</ButtonUI>
                  </center>
                </div>
              ) : null
            }
          </>
        ) : (
            <Alert>
              Your cart is empty! <Link to="/">Go shopping</Link>
            </Alert>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Cart);
