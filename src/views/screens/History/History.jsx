import React from "react";
import { connect } from "react-redux";
import { Table, Alert } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import swal from "sweetalert";

class History extends React.Component {
    state = {
        historyList: [],
        kondisi: false
    }
    getHistoryData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                _embed: "transactions_details",
                status: "completed",
                userId: this.props.user.id
            }
        })
            .then((res) => {
                console.log(res.data)
                this.setState({ historyList: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.historyList[idx],
            },
            kondisi: true
        })
    }
    renderHistoryData = ()=> {
        return this.state.historyList.map((val, idx) => {
            const { id, userId, totalPrice, status, tanggalBelanja, tanggalSelesai, transactions_details } = val
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{userId}</td>
                    <td>{totalPrice}</td>
                    <td>{status}</td>
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
                    {this.state.kondisi ? (
                        <>
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
                        </>
                    ) : null
                    }
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
                            <ButtonUI
                                className="ml-2"
                                type="outlined"
                                onClick={() => this.editBtnHandler(idx)}
                            >
                                Tampilkan Transaksi Detail
                            </ButtonUI>
                        </div>
                    </td>
                </tr>
            )
        })
    }
    componentDidMount() {
        this.getHistoryData()
    }
    render() {
        return(
            <div className="container py-4">
                {/* {this.state.wishData.length > 0 ? ( */}
                <>
                    <h3 className="text-center">History</h3>
                    <Table>
                        <thead>
                            <tr>
                                <th >No.</th>
                                <th >UserId</th>
                                <th >TotalPrice</th>
                                <th >Status</th>
                                <th >Tanggal Belanja</th>
                                <th >Tanggal Selesai</th>
                                <th >Transaksi Detail</th>
                                <th >Action</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderHistoryData()}</tbody>
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

const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };

export default connect(mapStateToProps)(History)