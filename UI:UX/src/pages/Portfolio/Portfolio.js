import { Dialog, DialogTitle, Grid2 } from "@mui/material";
import "./portfolio.css";
import { useEffect, useState } from "react";
import logo from '../../Assets/logo.png';
import axios from 'axios';
import {ethers} from "ethers"


const Portfolio = () => {
  const [modelList,setModeList]=useState([{id:0,checked:false,percentage:'0'},
    {id:1,checked:false,percentage:'0'},{id:2,checked:false,percentage:'0'},
    {id:3,checked:false,percentage:'0'},{id:4,checked:false,percentage:'0'},
    {id:5,checked:false,percentage:'0'}
  ]);
  const [isCardOpen,setIsCardOpen]=useState(false);
  const [currentContent,setCurrentContent]=useState({});
  
 

const handleOpen=(item,index)=>{
setIsCardOpen(true);
setCurrentContent(item);
}

const getSigner=async()=>{
  let web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = await web3Provider.getSigner();
  try{
    let data = await axios.get(`http://localhost:3001/vaults/${signer.address}`)
    setModeList(data.data)
    }
    catch{
      console.log("error");
    }
}
useEffect(()=>{
  getSigner()
   
  },[])
  // useEffect(async()=>{
  //   let web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  //   let signer = await web3Provider.getSigner();
  //   try{
  //   let data = await axios.get(`http://localhost:3001/vaults/${signer.address}`)
  //   setModeList(data.data)
  //   }
  //   catch{
  //     console.log("error");
  //   }
  // },[])
  return (
    <div className="main-wrapper">
        <div className="sub-wrapper">
       
      <div className="protfolio-cards">
      <div className="input-wrapper">
          <img src={logo} alt="logo" width="250px" height="65px" />
        </div>
       
      <Grid2 container size={12} columnSpacing={4} rowSpacing={2} justifyContent={"center"}alignItems={"center"} style={{width:"100%",height:"65%"}}>
        {modelList.map((item,index)=>{console.log(item,index);return(
            <Grid2 key={index} item size={4}>
<div className={"boxprot-wrapper"} onClick={()=>handleOpen(item,index)}>
<br></br>
  Chain :- {item?.chain}<br></br><br></br>
  Amount :- {item?.amount}<br></br><br></br>
  Models :- {item?.mlModels}<br></br><br></br>
  Weightage :- {item?.weightage}<br></br><br></br>
</div>
</Grid2>
        )})}
       </Grid2>

      </div>
      </div>
      {isCardOpen ? (
        <Dialog onClose={()=>setIsCardOpen(false)} open={isCardOpen}>
          <DialogTitle className="dialogue" sx={{padding:"14%",textAlign:"left",fontFamily: 'raleway'}}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          
          </DialogTitle>
        </Dialog>
      ) : (
        ""
      )}
    </div>
  );
};
export default Portfolio;
