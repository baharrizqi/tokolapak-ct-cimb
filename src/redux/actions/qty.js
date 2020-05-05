import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";
const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes;

export const navbarQty = (newQty) => {
    return (dispatch) => {
      const { userId, productId,quantity } = newQty;
      Axios.get(`${API_URL}/carts`, {
        params: {
          userId,
        },
      })
        .then((res) => {
          if (res.data.length > 0) {
            dispatch({
              type: ON_LOGIN_SUCCESS,
              payload: res.data[0],
            });
          } else {
            dispatch({
              type: ON_LOGIN_FAIL,
              payload: "Username atau password salah",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

//   export const navbarQty = () => {
//     return (dispatch) => {
//       Axios.get(`${API_URL}/carts`, {
//         params: {
//           userId: this.props.user.id,
//           _expand: "product",
//         },
//       })
//         .then((res) => {
//           dispatch({
//           console.log(res.data);
//           this.setState({ cartData: res.data });
//           this.state.cartData.map((val) => {
//             subQty += val.quantity
//           })
//           this.setState({ totalQty: subQty })
//         })
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }
  
  