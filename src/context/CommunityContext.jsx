import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const ForumContext = createContext();

export const useForum = () => {
    const context = useContext(ForumContext);
    if (!context) {
        throw new Error('useForum must be used within a ForumProvider');
    }
    return context;
};

export const ForumProvider = ({ children }) => {
    const [communities, setCommunities] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchCommunities = async () => {
        try {
            setLoading(true);
          const response = await axiosInstance.get('/api/community/get-forums');
          console.log(response);
          setCommunities(response.data);
        } catch (error) {
            setError(error);
          console.error('Error fetching communities:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ForumContext.Provider value={{ communities, loading, error, fetchCommunities }}>{children}</ForumContext.Provider>
    );
}