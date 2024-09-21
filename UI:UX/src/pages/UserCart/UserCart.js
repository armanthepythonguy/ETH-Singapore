import { Grid2 } from "@mui/material";
import "./usercart.css";
import { useEffect, useState } from "react";
import logo from '../../Assets/logo.png';
import { useLocation, useNavigate } from "react-router-dom";
import {ethers} from "ethers"
import abi from "../../abi.json";
import usdcabi from "../../usdc.json";
import axios from "axios";

const UserCart = () => {

    const { state } = useLocation();
  const handleSubmit=async()=>{
    let ids = []
    let weights = []
    for(let i of state.modelList){
      ids.push(i._id)
      weights.push(i.weight)
    }
    console.log(ids, weights)
    let web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await web3Provider.getSigner();
    const contractAddress = "0xD4BB924ecB94799ea497900E91Dc0dd316061EB3";
    const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
    const usdcContract = await new ethers.Contract(usdcAddress, usdcabi, signer);
    const contract = await new ethers.Contract(contractAddress, abi, signer);
    let tx = await usdcContract.approve(contractAddress, state.amount*1000000);
    tx = await contract.createVault(ids, weights, state.amount*1000000);
        await axios.post("http://localhost:3001/vaults", {
          "id":(await contract.vaultCount()).toString(),
          "chain": "11155111",
          "user": signer.address,
          "models": ids,
          "weights": weights,
          "amount": state.amount*1000000
        })
  }
  console.log(state,"state")
  return (
    <div className="main-wrapper">
        <div className="sub-wrapper">
       
      <div className="devmodel-cards">
      <div className="input-wrapper">
          <img src={logo} alt="logo" width="250px" height="65px" />
        </div>
      
      <Grid2 container size={12} columnSpacing={4} rowSpacing={0} justifyContent={"center"}alignItems={"center"} style={{width:"100%",height:"90%"}}>
        {state?.modelList?.map((item,index)=>{return(
            <Grid2 key={index} item size={6}>
                <div className="cart-wrapper">
            <div className="boxs-wrapper">
            <br></br>
  Chain :- {item?.chain}<br></br><br></br>
  Asset :- {item?.asset}<br></br> <br></br>
  Accuracy :- {item?.accuracy}<br></br>
            </div>
            <div className="mainpercent-wrapper">
                Percentage
              <input className="percentage-wrapper" type="number" onChange={(e) => item.weight = e.target.value } ></input>
            </div>
            </div>
</Grid2>       
)})}
       </Grid2>
<div className="button-wrap" style={{paddingTop:"1%",justifyContent:"center"}}>
<button className="add-button submit" style={{width:"30%"}} onClick={handleSubmit}>Submit</button>
</div>

  
      </div>
      </div>
    </div>
  );
};
export default UserCart;
