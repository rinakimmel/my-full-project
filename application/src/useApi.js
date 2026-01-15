import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const useApi = (resource) => {
    const [data, setData] = useState([]);

    const getItems = useCallback(async (params = {}) => {
        try {
            const response = await axios.get(`${BASE_URL}/${resource}`, { params });
            setData(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }, [resource]);

    const deleteItem = useCallback(async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${resource}/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting item:", error);
            return { success: false, error };
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
            return { success: false, error };
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

    return { data, getItems, deleteItem, updateItem, addItem };
};

export default useApi;