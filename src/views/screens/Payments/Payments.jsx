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
    }

    getPaymentsData = () => {
        Axios.get(`${API_URL}/transactions`)
            .then((res) => {
                this.setState({ paymentsList: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    renderPaymentsData = () => {
        return this.state.paymentsList.map((val, idx) => {
            const { id, userId, totalPrice, status, tanggalBelanja, tanggalSelesai } = val
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{userId}</td>
                    <td>{totalPrice}</td>
                    <td>{status}</td>
                    <td>{tanggalBelanja}</td>
                    <td>{tanggalSelesai}</td>
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
            status: "paid",
            tanggalSelesai: this.getTime()
        })
        .then(res=> {
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
    componentDidMount() {
        this.getPaymentsData()
    }
    render() {
        return (
            <div className="container py-4">
                {/* {this.state.wishData.length > 0 ? ( */}
                <>
                    <h3 className="text-center">Payments</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>UserId</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Tanggal Belanja</th>
                                <th>Tanggal Selesai</th>
                                <th>Action</th>
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