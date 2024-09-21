import "./metalogin.css";
import { useEffect, useState } from "react";
import meta from "../../Assets/meta.png";
import { Dialog, DialogTitle } from "@mui/material";
import logo from '../../Assets/logo.png';
import { IoIosCloseCircleOutline } from "react-icons/io";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
const MetaLogin = () => {
  const [isNotConnected, setIsNotConnected] = useState(false);
  const navigate=useNavigate();

  const handleClose = () => {
    setIsNotConnected(false);
  };
  
  const web3 = new Web3(
    Web3.givenProvider ||
    'https://rpc-mumbai.maticvigil.com/'
  )
  const metaLogin = async() => {
    if (window.ethereum) {
      let provider = window.ethereum?.providers
        ? window.ethereum.providers.find(item => !!item.isMetaMask) ?? window.ethereum
        : window.ethereum

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      }).catch(()=>{
        setIsNotConnected(true);
        // alert("User rejected connection")
      })
      if(accounts?.length>0){
          localStorage.setItem('walletaddress', accounts[0]);
          setIsNotConnected(false);
          navigate('/login');
      }
    }
  }
  useEffect(()=>{
    const accountValue=localStorage.getItem('walletaddress');
    if(accountValue!==null){
      navigate('/login')
    }
  },[])
  return (
    <div className="main-wrapper">
    
      <div className="card">
        <div className="input-wrapper">
          <img src={logo} alt="logo" width="250px" height="65px" />
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
          <div className="button-wrapper" style={{paddingTop:"14%"}}>
          {/* <button className="form-button"><CiUser />Login as User</button>
          <button className="form-button"><MdDeveloperMode />Login as Dev</button> */}
            {/* <GoogleLogin shape="pill"  onSuccess={responseMessage} onError={errorMessage} /> */}
            <button className="form-button" style={{height:"90px",fontsize:"20px"}} onClick={() => metaLogin()}>
              <img width="50px" height="30px" src={meta} alt="meta"/>
              Sign in with Metamask
            </button>
          </div>
        </div>
      </div>
      {isNotConnected ? (
        <Dialog onClose={handleClose} open={isNotConnected}>
          <DialogTitle className="dialogue">
          <IoIosCloseCircleOutline color="red" />
            Could not login to metamask. Please try again.
          </DialogTitle>
        </Dialog>
      ) : (
        ""
      )}
     
    </div>
  );
};
export default MetaLogin;
