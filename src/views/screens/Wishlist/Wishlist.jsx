import React from "react";
import { connect } from "react-redux";
import "./Wishlist.css";
import { Table, Alert } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import swal from "sweetalert";


class Wishlist extends React.Component {
    state = {
        wishData: [],
    };

    getWishData = () => {
        Axios.get(`${API_URL}/wishlist`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            },
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ wishData: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renderWishData = () => {
        return this.state.wishData.map((val, idx) => {
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
                        <div className="d-flex flex-row" >
                            <ButtonUI
                                type="outlined"
                                onClick={() => this.deleteWishHandler(id)}
                            >
                                Delete Item
                    </ButtonUI>
                            <ButtonUI
                                className="ml-2"
                                type="outlined"
                            onClick={()=>this.addToCart(val.userId,val.productId,idx,id)}
                            >
                                Add To Cart
                    </ButtonUI>
                        </div>
                    </td>
                </tr>
            );
        });
    }
    deleteWishHandler = (id) => {
        Axios.delete(`${API_URL}/wishlist/${id}`)
            .then((res) => {
                this.getWishData()
            })
            .catch((err) => {
                console.log(err);
            });
    };

    addToCart = (userId,productId,idx,id) => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                productId,
                userId,
            }
        })
            .then((res) => {
                if (res.data.length == 0) {
                    Axios.post(`${API_URL}/carts`, {
                        userId: this.props.user.id,
                        productId,
                        quantity: this.state.wishData[idx].quantity,
                    })
                        .then((res) => {
                            console.log(res);
                            swal(`Add to cart : ${res.data.quantity}`, "Your item has been added to your cart", "success");
                            this.deleteWishHandler(id)
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
                        quantity: res.data[0].quantity + this.state.wishData[idx].quantity
                    })
                        .then((res) => {
                            console.log(res.data)
                            swal(`Add to cart : ${res.data.quantity}`, `Your item has been added to your cart`, "success");
                            this.deleteWishHandler(id)
                        })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    componentDidMount() {
        this.getWishData()
    }

    render() {
        return (
            <div className="container py-4">
                {this.state.wishData.length > 0 ? (
                <>
                    <h3 className="text-center">Wishlist</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderWishData()}</tbody>
                    </Table>
                </>
                 ) : (
                        <Alert>
                            Your wishlist is empty! <Link to="/">Go shopping</Link>
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

export default connect(mapStateToProps)(Wishlist)