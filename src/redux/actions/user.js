import Axios from "axios"
import { API_URL } from "../../constants/API"
import swal from 'sweetalert'
import Cookie from 'universal-cookie'
import userTypes from '../types/user'

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes


const cookieObject = new Cookie()


export const loginHandler = (userData) => {
    return (dispatch) => {
        const { username, password } = userData
        Axios.get(`${API_URL}/users`, {
            params: {
                username,
                password,
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data[0]
                    })
                } else {
                    swal("", "Username atau password salah", "error")
                    dispatch({
                        type: ON_LOGIN_FAIL,
                        payload: "username atau password salah"
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
}


export const userKeepLogin = (userData) => {
    return dispatch => {
        Axios.get(`${API_URL}/users`, {
            params: {
                id: userData.id
            }
        })
            .then((res) => {
                if (res.data.length > 0) {
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data[0]
                    })
                } else {
                    dispatch({
                        type: ON_LOGIN_FAIL,
                        payload: "username atau password salah"
                    })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export const logoutHandler = () => {
    return (dispatch) => {
        dispatch({
            type: ON_LOGOUT_SUCCESS,
            payload: {
                username: "",
                fullName: "",
                role: "",
                id: 0,
            }
        })
        cookieObject.remove("authData")
        swal("", "Tunggu Sebentar!", "success")
    }
}

export const registerHandler = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username: userData.username,
      },
    })
      .then((res) => {
        if (res.data.length > 0) {
          dispatch({
            type: "ON_REGISTER_FAIL",
            payload: "Username sudah digunakan",
          });
        } else {
          Axios.post(`${API_URL}/users`, userData)
            .then((res) => {
                if (res.data.length > 0) {
                    dispatch({
                        type: "ON_REGISTER_FAIL",
                        payload: "username sudah digunakan",
                    });
                } else {
                    Axios.post(`${API_URL}/users`, userData)
                        .then((res) => {
                            console.log(res.data);
                            dispatch({
                                type: ON_LOGIN_SUCCESS,
                                payload: res.data,
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
