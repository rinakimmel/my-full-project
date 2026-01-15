import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const useApi = (resource) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);

    const getItems = useCallback(async (params = {}) => {
        setError(null)
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/${resource}`, { params });
            setData(response.data);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error("Error fetching data:", error);
            // return { success: false, error : "שגיאה בטעינת נתונים"};
            const errorMsg = "שגיאה בטעינת נתונים";
            setError(errorMsg);
            setData([]);
            return {
                success: false,
                error: errorMsg
            };
        }
        finally {
            setLoading(false);
        }
    }, [resource]);

    const deleteItem = useCallback(async (id) => {
        setError(null)
        setLoading(true);
        try {
            await axios.delete(`${BASE_URL}/${resource}/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting item:", error);
            const errorMsg = "שגיאה במחיקת הפריט";
            //return { success: false, error };
            setError(errorMsg)
            return {
                success: false,
                error: errorMsg
            };
        } finally {
            setLoading(false);
        }
    }, [resource]);

    const updateItem = useCallback(async (id, updateFields) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.patch(`${BASE_URL}/${resource}/${id}`, updateFields)
            setData(prev => prev.map(item =>
                item.id === id ? response.data : item
            ));
            return {
                success: true,
                data: response.data
            };
        }
         catch (error) {
            const errorMsg = "שגיאה בעדכון הפריט";
            setError(errorMsg);
            return { 
                success: false, 
                error: errorMsg 
            };
        } finally {
            setLoading(false);
        }
    }, [resource])

    const addItem = useCallback(async (newItem) => {
         setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${BASE_URL}/${resource}`, newItem);
            setData(prev => [...prev, response.data]);
            return { 
                success: true, 
                data: response.data 
            };
        } catch (err) {
            const errorMsg =  "שגיאה בהוספת הפריט";
            setError(errorMsg);
            return { 
                success: false, 
                error: errorMsg 
            };
        } finally {
            setLoading(false);
        }
    }, [resource]);

    return { data, error,loading, getItems, deleteItem, updateItem, addItem };
};

export default useApi;