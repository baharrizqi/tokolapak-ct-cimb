import Axios from "axios";
import { API_URL } from "../../constants/API";

// export const userProduct = (userData) => {
//     return (dispatch) => {
//     const { productName , id } = userData;
//       Axios.get(`${API_URL}/products`, {
//         params: {
//           productName,
//           id,
//         },
//       })
//         .then((res) => {
//           if (res.data.length > 0) {
//             dispatch({
//               type: "ON_LOGIN_SUCCESS",
//               payload: res.data[0],
//             });
//           } else {
//             dispatch({
//               type: "ON_LOGIN_FAIL",
//               payload: "Username atau password salah",
//             });
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     };
//   };

  
export const regisHandler = (userData) => {
    return (dispatch) => {
        const { productName, price, image,desc,id} = userData
        Axios.get(`${API_URL}/products`, {
       
        })
            .then(res => {
                Axios.post(`${API_URL}/products`, {
                    productName,
                    price,
                    image,
                    desc,
                    id,
                })
                    .then((res) => {
                    
                        dispatch({
                            type: "ON_REGIS_SUCCESS",
                            payload: res.data
                        })

                    })
                    .catch((err) => {
                    
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }
}
  