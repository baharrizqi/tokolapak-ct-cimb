import React from 'react'
import { connect } from 'react-redux'
import './Cart.css'
import Axios from 'axios'
import { Link } from "react-router-dom";
import { API_URL } from '../../../constants/API'
import ButtonUI from '../../components/Button/Button'
import { Alert } from 'reactstrap'

class Cart extends React.Component {
    state = {
        cartData: [],
    }
    componentDidMount() {
        this.addCart()
    }
    addCart = () => {
        Axios.get(`${API_URL}/cart`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            }
        })
            .then((res) => {
                this.setState({ cartData: res.data })
                console.log(this.state.cartData);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    renderArr = () => {
        return this.state.cartData.map((value, idx) => {
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{value.product.productName}</td>
                    <td>
                        {
                            new Intl.NumberFormat("id-ID",
                                {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(value.product.price)
                        }
                    </td>
                    <td>{value.product.desc}</td>
                    <td><img
                        style={{ width: "100%", objectFit: "contain", height: "100px" }}
                        src={value.product.image}
                        alt="" />
                    </td>
                    <td><ButtonUI onClick={() => this.deleteDataHandler(value.id)}>Delete</ButtonUI></td>
                </tr>
            )
        })
    }

    deleteDataHandler = (id) => {
        Axios.delete(`${API_URL}/cart/${id}`)
            .then((res) => {
                console.log(res.data);
                alert('delete')
                this.addCart()
            })
            .catch((err) => {
                console.log(err)
                alert('gamasuk')
            })
    }
    renderTable = () => {
        return (
            <div className="container">
                {
                    this.state.cartData.length > 0 ? (
                        <table class="table">
                            <thead class="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th>Name Product</th>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Photo Product</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody >
                                {this.renderArr()}
                            </tbody>
                        </table>
                    ): (
                        <Alert>
                            Your cart is empty! <Link to="/">Go Shopping</Link>
                        </Alert>
                    )
            }
            </div>
        )
    }

    render() {
        return (
            <div className="container">
                {this.renderTable()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(Cart)