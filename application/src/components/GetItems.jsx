// import { useLocation, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import useApi from "../useApi";
// function GetItems() {
//     const { userId, resource } = useParams();
//     // const [category_for_search, setCategory_for_search] = useState(location.state.from)
//     const [activeResource, setActiveResource] = useState(resource)
//     const [responseData, setResponseData] = useState([]);
//     // const contact_to_server = async () => {
//     //     try {
//     //         //const path = category_for_search || 'items';
//     //         console.log("path is ", resource);
//     //         const response = await axios.get(`http://localhost:3000/${activeResource}?userId=${userId}`);
//     //         setResponseData(response.data || [])
//     //         console.log("jj")
//     //         console.log(response.data && response.data[0]);
//     //     }
//     //     catch (err) {
//     //         console.log(err);
//     //     }
//     // }



//     useEffect(() => {
//         setResponseData(resource);
//         const response = useApi(`http://localhost:3000/${activeResource}?userId=${userId}`);
   
//     }, [resource]);

//     return (<>
//         <div>this component is {activeResource} get to server</div>
//         <h2>{activeResource}</h2>
//         <div>
//             {Array.isArray(responseData) && responseData.map((item, index) => (
//                 <div key={index}>
//                     <div>{item.title}</div>
//                 </div>
//             ))}
//         </div>

//     </>)
// }
// export default GetItems;


import { useParams } from "react-router-dom";
import useApi from "../useApi";

function GetItems() {
    const { userId, resource } = useParams();

    // קריאה ל-Hook בראש הקומפוננטה.
    // ה-Hook כבר מכיל בתוכו את ה-useEffect וה-State.
    const responseData = useApi(`http://localhost:3000/${resource}?userId=${userId}`);

    return (
        <>
            <div>this component is {resource} get to server</div>
            <h2>{resource}</h2>
            <div>
                {Array.isArray(responseData) && responseData.map((item, index) => (
                    <div key={index}>
                        <div>{item.title}</div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default GetItems;