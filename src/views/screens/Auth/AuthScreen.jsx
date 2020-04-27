import React from 'react'
import TextField from '../../components/TextField/TextField'
import ButtonUI from '../../components/Button/Button'
import './AuthScreen.css'

class AuthScreen extends React.Component {
  btnHandler= () => {
    alert('masuk')
  }
  state = {
    condition: true
  }
  registerHandler = () => {
    this.setState({condition:true})
  }
  loginHandler = () => {
    this.setState({condition:false})
  }

  render() {
    return (
      <div>
        { 
        !this.state.condition?
        (<div className="container">
          <div className="row mt-5">
            <div className="col-5">
              <div>
                <div className="d-flex">
                  <input type="button" value="Register" className="btn btn-light mr-3" onClick={this.registerHandler}/>
                  <input type="button" value="Login" className="btn btn-dark" onClick={this.loginHandler}/>
                </div>
                <h3 className="mt-2">Log In</h3>
                <p className="mt-4">Welcome back,<br /> Please, login to your account</p>
                <TextField placeholder="Username" className="mt-5" />
                <TextField placeholder="Password" className="mt-2" />
                <input type="checkbox" name="" id="" className="mt-2" /> Remember me
                            <div className="d-flex justify-content-center">
                  <ButtonUI type="contained" className="mt-4">
                    Login
                  </ButtonUI>
                </div>
                <p className="text-center mt-3" style={{ color: "#3C64B1" }}>Forgot password?</p>
              </div>
            </div>
            <div className="col-7">Picture</div>
          </div>
        </div>)
        :
        <div className="container">
          <div className="row mt-5">
            <div className="col-5">
              <div>
                <div className="d-flex">
                  <input type="button" value="Register" className="btn btn-dark mr-3" onClick={this.registerHandler}/>
                  <input type="button" value="Login" className="btn btn-light" onClick={this.loginHandler}/>
                </div>
                <h3 className="mt-2">Register</h3>
                <p className="mt-4">You will get the best recommendation for rent <br /> house in near of you</p>
                <TextField placeholder="Name" className="mt-5" />
                <TextField placeholder="Email" className="mt-2" />
                <TextField placeholder="Password" className="mt-2" />
                <TextField placeholder="Confirm password" className="mt-2" />
               <input type="checkbox"/> <span>I agree to</span> <span style={{color: "blue"}}>Terms of Use</span>
                <div className="d-flex justify-content-center">
                  <ButtonUI type="contained" className="mt-4">
                    Register
                  </ButtonUI>
                </div>
                <p className="text-center mt-3" style={{ color: "#3C64B1" }}>Forgot password?</p>
              </div>
            </div>
            <div className="col-7">Picture</div>
          </div>
        </div>
      
      }
      </div>





    )
  }
}

export default AuthScreen
