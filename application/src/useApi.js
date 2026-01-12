// import axios from "axios";
// import { useEffect, useState } from "react";

// async function useApi(url) {
// const response=await axios.get(url);
// return response.data;   
// }


// export default useApi;

// import { useState, useEffect } from "react";
// import axios from "axios";

// const useApi = (method, url) => {
//     // ה-State נמצא כעת בתוך ה-Hook
//     const [data, setData] = useState([]);

//     const getData = async (url) => {
//         try {
//             const response = await axios.get(url);
//             setData(response.data);
//         } catch (error) {
//             console.error(error);
//         }
//         return data;
//     };

//     const deleteData = async (url) => {
//         try {
//             await axios.delete(url);
//         }
//         catch (error) {
//             console.error(error);
//         }
//     }
//     useEffect(() => {
//         if (url && method === "get") {
//             getData(url);
//         }
//         if (url && method === "delete") {
//             deleteData(url);
//         }
//     }, [method, url]);

//     return data; // מחזיר ישירות את המידע
// };

// export default useApi;

import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const useApi = (resource) => {
    const [data, setData] = useState([]);

    // פונקציה לקבלת נתונים - מקבלת אובייקט פרמטרים אופציונלי
    const getItems = useCallback(async (params = {}) => {
        try {
            const response = await axios.get(`${BASE_URL}/${resource}`, { params });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [resource]);

    // פונקציה למחיקה
    const deleteItem = useCallback(async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${resource}/${id}`);
            // עדכון הסטייט המקומי מיידית כדי לחסוך פנייה נוספת לשרת (אופטימיזציה)
            setData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }, [resource]);

    const updateItem = useCallback(async (id, updateFields) => {

        try {
            const response = await axios.patch(`${BASE_URL}/${resource}/${id}`, updateFields)
            setData(prev => prev.map(item =>
                item.id === id ? response.data : item
            ));
        }
        catch (error) {
            console.error("Error updating item:", error);
        }
    },[resource])
    // החזרת אובייקט עם הנתונים והפונקציות
    return { data, getItems, deleteItem, updateItem };
};

export default useApi;