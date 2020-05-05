import React from "react";
import { connect } from "react-redux";
import "./Payments.css";
import { Table, Alert } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import TextField from '../../components/TextField/TextField'

class Payments extends React.Component {
    state = {
        paymentsList: [],
        createForm: {
            status: "",
        },
    }

    getPaymentsData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                _embed: "transactions_details",
            }
        })
            .then((res) => {
                console.log(res.data)
                console.log(this.state.createForm.status)
                this.setState({ paymentsList: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    filterCategoryBtn = (statusAll) => {
        if (!statusAll) {
            Axios.get(`${API_URL}/transactions`,{
                params: {
                    _embed: "transactions_details",
                }
            })
                .then(res => {
                    this.setState({ paymentsList: res.data })
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else {
            Axios.get(`${API_URL}/transactions`, {
                params: {
                    status: statusAll,
                    _embed: "transactions_details"
                }
            })
                .then(res => {
                    this.setState({ paymentsList: res.data })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }


    renderPaymentsData = () => {
        return this.state.paymentsList.map((val, idx) => {
            const { id, userId, totalPrice, status, tanggalBelanja, tanggalSelesai, transactions_details, username } = val
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{username}</td>
                    <td>{totalPrice}</td>
                    {
                        status == "pending" ? (
                            <td style={{ color: "red" }}>{status}</td>
                        ) : <td style={{ color: "blue" }}>{status}</td>
                    }
                    <td>{tanggalBelanja}</td>
                    <td>{tanggalSelesai}</td>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>ProductId</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions_details.map((val, idx) => {
                            return (
                                <tr>
                                    <td>{idx + 1}</td>
                                    <td>{val.productId}</td>
                                    <td>{val.price}</td>
                                    <td>{val.quantity}</td>
                                    <td>{val.totalHarga}</td>
                                </tr>
                            )
                        })}
                    </tbody>

                    <td>
                        <div className="d-flex flex-row" >
                            <ButtonUI
                                type="outlined"
                                onClick={(_) => this.confirmBtnPayments(id)}
                            >
                                Konfirmasi
                            </ButtonUI>
                            <ButtonUI
                                className="ml-2"
                                type="outlined"
                                onClick={() => this.deletePaymentsHandler(id)}
                            >
                                Delete
                            </ButtonUI>
                        </div>
                    </td>
                </tr>
            )
        })
    }
    getTime = () => {
        let dateNow = new Date()
        let time = dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds();
        return dateNow.toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) + "-" + time
    }
    confirmBtnPayments = (id) => {
        Axios.patch(`${API_URL}/transactions/${id}`, {
            status: "completed",
            tanggalSelesai: this.getTime()
        })
            .then(res => {
                this.getPaymentsData()
            })
            .catch(err => {
                console.log(err)
            })
    }
    deletePaymentsHandler = (id) => {
        Axios.delete(`${API_URL}/transactions/${id}`)
            .then((res) => {
                this.getPaymentsData()
            })
            .catch((err) => {
                console.log(err);
            });
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
    componentDidMount() {
        this.getPaymentsData()
    }
    render() {
        return (
            <div className="container py-4">
                {/* {this.state.wishData.length > 0 ? ( */}
                <>
                    <h3 className="text-center">Payments</h3>
                    <div className="d-flex flex-row">
                        <ButtonUI onClick={() => this.filterCategoryBtn()}>ALL</ButtonUI>
                        <ButtonUI className="ml-2" onClick={() => this.filterCategoryBtn("completed")}>Completed</ButtonUI>
                        <ButtonUI className="ml-2" onClick={() => this.filterCategoryBtn("pending")}>Pending</ButtonUI>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th >No.</th>
                                <th>Username</th>
                                <th >TotalPrice</th>
                                <th >Status</th>
                                <th >Tanggal Belanja</th>
                                <th >Tanggal Selesai</th>
                                <th >Transaksi Detail</th>
                                <th >Action</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderPaymentsData()}</tbody>
                    </Table>
                </>
                {/* ) : (
                        <Alert>
                            Your wishlist is empty! <Link to="/">Go shopping</Link>
                        </Alert>
                    )}  */}
            </div>
        )
    }
}

export default connect()(Payments)