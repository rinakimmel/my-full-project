import { useLocation } from "react-router-dom";     
function GetItems(){
    const location= useLocation();
return(<>
<div>this component is {location.state.from} get to server</div>
</>)
}
export default GetItems;