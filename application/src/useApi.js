// import axios from "axios";
// import { useEffect, useState } from "react";

// async function useApi(url) {
// const response=await axios.get(url);
// return response.data;   
// }
  

// export default useApi;

import { useState, useEffect } from "react";
import axios from "axios";

const useApi = (url) => {
    // ה-State נמצא כעת בתוך ה-Hook
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url]); // ירוץ מחדש בכל פעם שה-URL משתנה

    return data; // מחזיר ישירות את המידע
};

export default useApi;