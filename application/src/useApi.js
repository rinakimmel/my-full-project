import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const useApi = (resource) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null)
    const getItems = useCallback(async (params = {}) => {
        try {
            const response = await axios.get(`${BASE_URL}/${resource}`, { params });
            setData(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
<<<<<<< HEAD
            // return { success: false, error : "שגיאה בטעינת נתונים"};
            setError("שגיאה בטעינת נתונים");
            return [];
=======
            throw error;
>>>>>>> e89ff6f6d0b91cdd16eb65ee0c8e73f8feeed502
        }
    }, [resource]);

    const deleteItem = useCallback(async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${resource}/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting item:", error);
            //return { success: false, error };
            setError("שגיאה במחיקת הפריט")
        }
    }, [resource]);

    const updateItem = useCallback(async (id, updateFields) => {
        try {
            const response = await axios.patch(`${BASE_URL}/${resource}/${id}`, updateFields)
            setData(prev => prev.map(item =>
                item.id === id ? response.data : item
            ));
            return { success: true, data: response.data };
        }
        catch (error) {
            console.error("Error updating item:", error);
            setError("שגיאה בעדכון הפריט")
        }
    }, [resource])

    const addItem = useCallback(async (newItem) => {
        try {
            const response = await axios.post(`${BASE_URL}/${resource}`, newItem);
            setData(prev => [...prev, response.data]);
            return response.data;
        } catch (error) {
            console.error("Error adding item:", error);
            return { success: false, error };
        }
    }, [resource]);

    return { data, error, getItems, deleteItem, updateItem, addItem };
};

export default useApi;