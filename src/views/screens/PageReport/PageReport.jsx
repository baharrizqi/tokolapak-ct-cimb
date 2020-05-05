import React from "react";
import { connect } from "react-redux";
import { Table, Alert } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import TextField from '../../components/TextField/TextField'

class PageReport extends React.Component {
    state = {
        reportUserList: [],
        reportData: [],
        totalBelanjaOk: [],
        productOk: [],
        barangKu: []
    }
    getReportData = () => {
        let subTotal = 0
        Axios.get(`${API_URL}/users`, {
            params: {
                role: "user"
            }
        })
            .then((res) => {
                console.log(res.data)
                this.setState({ reportData: res.data })
                res.data.map((val) => {
                    this.setState({
                        reportUserList: [...this.state.reportUserList, val.username]
                    })
                })
                this.state.reportData.map((val) => {
                    Axios.get(`${API_URL}/transactions`, {
                        params: {
                            _embed: "transactions_details",
                            userId: val.id,
                            status: "completed"
                        }
                    })
                        .then((res) => {
                            res.data.map((val) => {
                                subTotal += val.totalPrice
                            })
                            this.setState({
                                totalBelanjaOk: [...this.state.totalBelanjaOk, subTotal],
                            })
                        })
                        .catch(err=> {
                            console.log(err)
                        })
                })
            })
            .catch((err) => {
                console.log(err);
            })
        Axios.get(`${API_URL}/transactions`, {
            params: {
                status: "completed",
                _embed: "transactions_details"
            }
        })
            .then((res) => {
                this.setState({
                    productOk: res.data
                })

            })
            .catch((err) => {
                console.log(err)
            })
        Axios.get(`${API_URL}/products`)
        .then(res=> {
            this.setState({barangKu:res.data})
        })
        .catch(err=> {
            console.log(err)
        })
    }
    renderReportData = () => {
        return this.state.totalBelanjaOk.map((val, idx) => {
            // const { id, userId, totalPrice, status, tanggalBelanja, tanggalSelesai, transactions_details, username } = val
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{this.state.reportUserList[idx]}</td>
                    <td>{val}</td>
                    {/* <tbody>
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
                    </tbody> */}
                </tr>
            )
        })
    }
    renderReportProduct = () => {
        return this.state.barangKu.map((val,idx) => {
            const { productName, id } = val
            let subTotal = 0
            this.state.productOk.map((valA) => {
                valA.transactions_details.map((valB) => {
                    if (id === valB.productId) {
                        subTotal += valB.quantity
                    }
                    else {
                        subTotal = subTotal
                    }
                })
            })
                return (
                    <>
                        <tr>
                            <td>{idx+1}</td>
                            <td>{productName}</td>
                            <td>{subTotal}</td>
                        </tr>
                    </>
                )
        })
    }

    componentDidMount() {
        this.getReportData()
    }
    render() {
        return (
            <div className="container py-4">
                {/* {this.state.wishData.length > 0 ? ( */}
                <>
                    <h3 className="text-center">Report</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th >No.</th>
                                <th> Username</th>
                                <th >TotalPrice</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderReportData()}</tbody>
                        <tfoot>

                        </tfoot>
                    </Table>

                    <Table className="mt-5">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>ProductName</th>
                                <th>Banyaknya Beli</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderReportProduct()}</tbody>
                    </Table>
                </>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(PageReport)