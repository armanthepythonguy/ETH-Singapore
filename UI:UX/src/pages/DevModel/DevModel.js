import "./devmodel.css";
import { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import Box from '@mui/material/Box';
import logo from '../../Assets/logo.png';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import { Dialog, DialogTitle } from "@mui/material";
import { TiTickOutline } from "react-icons/ti";
import {ethers} from "ethers"
import abi from "../../abi.json";
import usdcabi from "../../usdc.json";

const DevModel = () => {
  const [asset, setAsset] = useState('');
  const [assetFile,setAssetFile]= useState('');
  const [isTransipiration,setIsTransipiration]=useState(false);
  const [isVerfied,setIsVerfied]=useState(false);
  const [isStacked,setIsStacked]=useState(false);
  const handleChange = (event) => {
    setAsset(event.target.value);
  };
  const handleInput = (e) => {
    setAssetFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };
  
 const handleSubmit=async()=>{
  let web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = await web3Provider.getSigner();
  const contractAddress = "0xD4BB924ecB94799ea497900E91Dc0dd316061EB3";
  const contract = await new ethers.Contract(contractAddress, abi, signer);
  let tx = await contract.addModel("0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14")
    // await axios.post("http://localhost:3001/models", {
    //   "id":(await contract.modelCount()).plus(1).toString(),
    //   "chain": "11155111",
    //   "asset":asset.toLocaleUpperCase(),
    //   "deployer": signer.address,
    //   "accuracy": Math.random() * (95 - 80) + 80
    // })
 }
 const handleClose=()=>{
    
 }
  return (
    <div className="main-wrapper">
       
      <div className="dev-cards">
      <div className="input-wrapper">
          <img src={logo} alt="logo" width="250px" height="65px" />
        </div>
      <div className="button-wrapp" style={{paddingTop:"4%"}}>
        <Box className="select-button">
      <FormControl  variant="filled"  sx={{color:"white",border:'none'}} fullWidth>
      <InputLabel sx={{color:"white", fontFamily:'raleway', "&.Mui-focused": {
      color: "white"
    }, "&.Mui-focused:hover": {
      color: "black"
    },}}>Asset</InputLabel>
        <Select
          value={asset}
          label="Asset"
          onChange={handleChange}
          sx={{
            boxShadow: "none",
            color:"white",
           
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            "&.MuiOutlinedInput-root:hover &.MuiOutlinedInput-root::before .MuiOutlinedInput-notchedOutline":
              {
                border: 0,
                color:"black",
              },
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: 0,
              },
          }}
        >
          
          <MenuItem value={'wbtc'}>WBTC</MenuItem>
          <MenuItem value={'weth'}>WETH</MenuItem>
          <MenuItem value={'dai'}>DAI</MenuItem>
        </Select>
      </FormControl>
    </Box>
       
    <div className="button-wrap">
        <button  className="upload-button"><IoAddOutline /> Upload ONNX Model</button>
        <input
              className="add-input"
              placeholder="New Task"
              type="file"
              onChange={handleInput}
            />
               </div>
       </div>
       <div className="button-wrap" style={{paddingTop:"15%"}}>
        <button  className="add-button submit" onClick={handleSubmit}> Submit</button>
       
       </div>
      </div>
      {isTransipiration ? (
        <Dialog onClose={()=>setIsTransipiration(false)} open={isTransipiration}>
          <DialogTitle className="dialogue" sx={{ fontFamily:'raleway'}}>
            <TiTickOutline color="green" />
            Transpiration successfull!
          </DialogTitle>
          {isVerfied?<DialogTitle className="dialogue"  sx={{ fontFamily:'raleway'}}>
            <TiTickOutline color="green" />
            Verification successfull!
          </DialogTitle>:""}
          {isStacked? <DialogTitle className="dialogue"  sx={{ fontFamily:'raleway'}}>
            <TiTickOutline color="green" />
            Stacking successfull!
          </DialogTitle>:""}
        </Dialog>
      ) : (
        ""
      )}
    
    </div>
  );
};
export default DevModel;
