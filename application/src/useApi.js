// import axios from "axios";
// import { useEffect, useState } from "react";

// async function useApi(url) {
// const response=await axios.get(url);
// return response.data;   
// }


// export default useApi;

import { useState, useEffect } from "react";
import axios from "axios";

const useApi = (method, url) => {
    // ה-State נמצא כעת בתוך ה-Hook
    const [data, setData] = useState([]);

    const getData = async (url) => {
        try {
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
        return data;
    };

    const deleteData = async (url) => {
        try {
            await axios.delete(url);
        }
        catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        if (url && method === "get") {
            getData(url);
        }
        if (url && method === "delete") {
            deleteData(url);
        }
    }, [method, url]);

    return data; // מחזיר ישירות את המידע
};

export default useApi;