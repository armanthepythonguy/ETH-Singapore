import "./login.css";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { MdDeveloperMode } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from '../../Assets/logo.png';
const Login = () => {
  const [user, setUser] = useState("");
  const [dev, setdev] = useState("");
  const navigate=useNavigate();

 
  const loginUser = ( type) => {
    if (type === "user"){ setUser('user');navigate('/model')}
    else if (type === "dev") {setdev('dev');navigate('/devmodel')}
  };

  return (
    <div className="main-wrapper">
      <div className="card">
      <div className="input-wrapper">
          <img src={logo} alt="logo"  width="250px" height="65px" />
        </div>
        <div className="input-wrapper">
       
          {/* <div className="form-heading">
            <input
              className="form-input"
              placeholder="Attach File"
              defaultValue={password}
              type="file"
              onChange={(e) => handleInput(e, "file")}
            />
          </div> */}
          <div className="button-wrapper">
          <button className="form-button" onClick={()=>loginUser('user')}><CiUser />Login as User</button>
          <button className="form-button" onClick={()=>loginUser('dev')}><MdDeveloperMode />Login as Dev</button>
            {/* <GoogleLogin shape="pill"  onSuccess={responseMessage} onError={errorMessage} /> */}
          
          </div>
        </div>
      </div>
   
    </div>
  );
};
export default Login;
