import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
function GetItems() {
    const userId = 2;
    const location = useLocation();
    const [category_for_search,setCategory_for_search]=useState(location.state.from)
    const [responseData, setResponseData] = useState([]);
    const contact_to_server = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/${category_for_search}?userId=${userId}`);
            setResponseData(response.data || [])
            console.log("jj")
            console.log(response.data[0]);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setCategory_for_search(location.state.from);
    }, [location.state.from]);

    useEffect(() => {
        contact_to_server();
    }, [category_for_search])

    return (<>
        <div>this component is {category_for_search} get to server</div>
        <h2>{category_for_search}</h2>
        <div>
            {Array.isArray(responseData) && responseData.map((item, index) => (
                <div key={index}>
                    <div>{item.title}</div>
                </div>
            ))}
        </div>

    </>)
}
export default GetItems;
