import React from "react";
import { connect } from "react-redux";
import "./Members.css";
import { Table, Alert } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import TextField from '../../components/TextField/TextField'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'


class Members extends React.Component {
    state = {
        membersList: [],
        createForm: {
            username: "",
            fullName: "",
            password: "",
            email: "",
            role: "",
        },
        editForm: {
            id: 0,
            username: "",
            fullName: "",
            password: "",
            email: "",
            role: "",
        },
        kondisi: false
    }

    getMembersList = () => {
        Axios.get(`${API_URL}/users`)
            .then((res) => {
                this.setState({ membersList: res.data })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    renderMembersData = () => {
        return this.state.membersList.map((val, idx) => {
            const { id, username, fullName, password, email, role } = val
            return (
                <tr>
                    <td>{idx + 1}</td>
                    <td>{username}</td>
                    <td>{fullName}</td>
                    <td>{password}</td>
                    <td>{email}</td>
                    <td>{role}</td>
                    <td>
                        <div className="d-flex flex-row" >
                            <ButtonUI
                                type="outlined"
                                onClick={(_) => this.editBtnHandler(idx)}
                            >
                                Edit
                    </ButtonUI>
                            <ButtonUI
                                className="ml-2"
                                type="outlined"
                            onClick={() => this.deleteMembersHandler(id)}
                            >
                                Delete
                    </ButtonUI>
                        </div>
                    </td>
                </tr>
            )
        })
    }
    deleteMembersHandler = (id) => {
        Axios.delete(`${API_URL}/users/${id}`)
            .then((res) => {
                this.getMembersList()
            })
            .catch((err) => {
                console.log(err);
            });
    }
    createMembersHandler = () => {
        Axios.post(`${API_URL}/users`, this.state.createForm)
            .then((res) => {
                swal("Success!", "New Member Berhasil", "success")
                this.getMembersList()
                this.setState({
                    createForm: {
                        username: "",
                        fullName: "",
                        password: "",
                        email: "",
                        role: "",
                    },
                })
            })
            .catch((err) => {
                swal("Error!", "New Member Gagal", "error")
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
    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.membersList[idx],
            },
            kondisi: true
        })
    }
    editMembersHandler = () => {
        Axios.put(`${API_URL}/users/${this.state.editForm.id}`,
            this.state.editForm
        )
            .then((res) => {
                swal("Success!", "Your Member has been edited", "success")
                this.getMembersList()
                this.setState({
                    editForm: {
                        username: "",
                        fullName: "",
                        password: "",
                        email: "",
                        role: "",
                    },
                    kondisi:false
                })
            })
            .catch((err) => {
                swal("Error!", "Your Member could not be edited", "error")
                console.log(err);
            })
    }

    componentDidMount() {
        this.getMembersList()
    }
    render() {
        return (
            <>
                <div className="container py-4">
                    {/* {this.state.wishData.length > 0 ? ( */}
                    <>
                        <h3 className="text-center">Members</h3>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Username</th>
                                    <th>Fullname</th>
                                    <th>Password</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderMembersData()}</tbody>
                        </Table>
                    </>
                    {/* ) : (
                        <Alert>
                            Your wishlist is empty! <Link to="/">Go shopping</Link>
                        </Alert>
                    )}  */}
                </div>

                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add New Member</h2>
                    </caption>
                    <div className="row">
                        <div className="col-8">
                            <TextField
                                value={this.state.createForm.username}
                                placeholder="Username"
                                onChange={(e) =>
                                    this.inputHandler(e, "username", "createForm")
                                }
                            />
                        </div>
                        <div className="col-4">
                            <TextField
                                value={this.state.createForm.password}
                                placeholder="Password"
                                onChange={(e) => this.inputHandler(e, "password", "createForm")}
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <textarea
                                value={this.state.createForm.fullName}
                                onChange={(e) => this.inputHandler(e, "fullName", "createForm")}
                                style={{ resize: "none" }}
                                placeholder="Description"
                                className="custom-text-input"
                            ></textarea>
                        </div>
                        <div className="col-6 mt-3">
                            <TextField
                                value={this.state.createForm.email}
                                placeholder="Email"
                                onChange={(e) => this.inputHandler(e, "email", "createForm")}
                            />
                        </div>
                        <div className="col-6 mt-3">
                            <select
                                value={this.state.createForm.role}
                                className="custom-text-input h-100 pl-3"
                                onChange={(e) => this.inputHandler(e, "role", "createForm")}
                            >
                                <option value="admin">admin</option>
                                <option value="user">user</option>
                            </select>
                        </div>
                        <div className="col-3 mt-3">
                            <ButtonUI onClick={this.createMembersHandler} type="contained">
                                Create New Member
                        </ButtonUI>
                        </div>
                    </div>
                </div>
                {
                    this.state.kondisi ? (
                        <div className="dashboard-form-container p-4">
                        <caption className="mb-4 mt-2">
                            <h2>Edit Member</h2>
                        </caption>
                        <div className="row">
                            <div className="col-8">
                                <TextField
                                    value={this.state.editForm.username}
                                    placeholder="Username"
                                    onChange={(e) =>
                                        this.inputHandler(e, "username", "editForm")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <TextField
                                    value={this.state.editForm.password}
                                    placeholder="Password"
                                    onChange={(e) => this.inputHandler(e, "password", "editForm")}
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <textarea
                                    value={this.state.editForm.fullName}
                                    onChange={(e) => this.inputHandler(e, "fullName", "editForm")}
                                    style={{ resize: "none" }}
                                    placeholder="Description"
                                    className="custom-text-input"
                                ></textarea>
                            </div>
                            <div className="col-6 mt-3">
                                <TextField
                                    value={this.state.editForm.email}
                                    placeholder="Email"
                                    onChange={(e) => this.inputHandler(e, "email", "editForm")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <select
                                    value={this.state.editForm.role}
                                    className="custom-text-input h-100 pl-3"
                                    onChange={(e) => this.inputHandler(e, "role", "editForm")}
                                >
                                    <option value="admin">admin</option>
                                    <option value="user">user</option>
                                </select>
                            </div>
                            <div className="col-3 mt-3">
                                <ButtonUI onClick={this.editMembersHandler} type="contained">
                                    Edit Member
                            </ButtonUI>
                            </div>
                        </div>
                    </div>
                    ): null
                }
            </>
        )
    }
}

export default connect()(Members)