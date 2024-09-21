import { Grid2 } from "@mui/material";
import "./model.css";
import { useEffect, useState } from "react";
import logo from '../../Assets/logo.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Model = () => {
  const [amount, setAmount] = useState("");
  const [modelList,setModeList]=useState([]);
  const [isChecked,setIsChecked]=useState(false);
  const navigate=useNavigate();

const handleInput=(e)=>{
setAmount(e.target.value);
}
  const handleChange = (e,item) => {
    console.log(e.target.checked,item,"item")
    let arr=modelList;
    let foundIndex = arr.findIndex(x => x._id == item._id);
    arr[foundIndex].checked = e.target.checked;
    console.log(arr,"arr")
    setModeList(arr);
    setIsChecked((prev)=>!prev)
  };
  const handleDone=()=>{
    const filteredArr=modelList;
    const filtered=filteredArr.filter((item)=>item.checked===true)
navigate('/userCart', {
    state: {
      amount:amount,
      modelList:filtered
    }})
}
const handleProtfolio=()=>{
    console.log("clicked")
    navigate('/portfolio')
}
  useEffect(()=>{
    try{
  axios.get("http://localhost:3001/models").then((data) => {
    let res = data.data;
    for(let i of res){
      i.checked = false
    }
    console.log(res)
    setModeList(res)
  }).catch(()=>{
    console.log("error")
  });
}
catch{
  console.log("error")
}
  },[])
  return (
    <div className="main-wrapper">
        <div className="sub-wrapper">
       
      <div className="model-cards">
      <div className="input-wrapper">
          <img src={logo} alt="logo" width="250px" height="65px" />
        </div>
        <div className="input-wrapper">
            <div className="protfolio-wrapper">
<input type="text"  className="form-input"
              defaultValue={amount}
              onChange={(e) => handleInput(e)} placeholder="Enter Amount"/>
              <button className="add-button" style={{width:"30%"}} onClick={handleProtfolio}>My Portfolio</button>
              </div>
        </div>
      <Grid2 container size={12} columnSpacing={4} rowSpacing={2} justifyContent={"center"}alignItems={"center"} style={{width:"100%",height:"65%"}}>
        {modelList?.map((item,index)=>{console.log(item,index);return(
            <Grid2 key={index} item size={4}>
              
<input id={`cbx${index}`} type="checkbox" onChange={(e)=>handleChange(e,item)}/>
          
<label for={`cbx${index}`} className={item?.checked?"checked-box-wrapper":"box-wrapper"}>
<br></br>
  Chain :- {item?.chain}<br></br><br></br>
  Asset :- {item?.asset}<br></br> <br></br>
  Accuracy :- {item?.accuracy}<br></br>
</label>

</Grid2>
        )})}
       </Grid2>
<div className="button-wrap" style={{paddingTop:"1%"}}>
<button className="add-button" style={{width:"30%"}} onClick={handleDone}>Done</button>
</div>
      </div>
      </div>
    </div>
  );
};
export default Model;
