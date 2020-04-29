import React from 'react'
import {connect} from 'react-redux'
import './Cart.css'
import Axios from 'axios'
import { API_URL } from '../../../constants/API'

class Cart extends React.Component{
    componentDidMount() {
        Axios.get(`${API_URL}/cart`,{
            params:{
                userId: this.props.user.id,
                _expand:"product",
            }
        })
        .then((res)=> {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    renderTable =() => {

    }
    deleteTable =() => {
        
    }
    render(){
        return(
            <div className="container">
                <div>Cart</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        user: state.user,
    }
}

export default connect(mapStateToProps)(Cart)