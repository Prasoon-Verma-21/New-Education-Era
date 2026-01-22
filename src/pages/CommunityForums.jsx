import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useForum } from "../context/CommunityContext";
import { LoaderCircle } from "lucide-react";

// Extended dummy data for forum threads and replies


export default function CommunityForums() {

  
  const {communities, fetchCommunities, loading} = useForum()

  useEffect(() => {
    fetchCommunities();
  }, []);

  const navigate = useNavigate();
  const goToForum = (forum) => {
    const name = forum.name.replace(/\s+/g, '-').toLowerCase();
    navigate(`/learning-hub/community-forums/${name}`, { state: { forumId: forum._id } });
  };

  return (
    <div className="bg-gray-200 md:p-10 p-5">
      <h1 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-900 md:text-5xl text-4xl font-bold mb-2">Community Forums</h1>
      <p className="text-center text-transparent bg-clip-text bg-gradient-to-l from-gray-300 to-gray-900 md:text-xl text-sm font-semibold">Welcome to the community forums! Here you can discuss various topics with other users.</p>
      
      { loading ? <LoaderCircle className="w-20 h-20 m-auto mt-10 animate-spin" /> :
        <div className="flex flex-row md:p-20 p-5 flex-wrap items-center justify-center gap-20 mt-4 mb-4">
        {communities?.map((community) => (
          <div key={community._id} className="md:w-[30%] bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-blue-300 border-[5px] hover:scale-105 transition-transform duration-300 ease-in-out border-x-blue-600">
          <img
            src={community.imageUrl}
            alt={community.name}
            className="w-full h-48 cursor-pointer object-cover hover:scale-105 transotion-transform duration-300 ease-in-out"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-900">{community.name}</h2>
            <p className="mt-2 text-gray-600 text-sm">{community.description}</p>
            <button onClick={() => goToForum(community)} className="bg-gradient-to-r from-blue-500 to-blue-800 hover:scale-105 transition-transform duration-100 ease-in-out px-3 py-1 text-xl mt-2 text-white rounded-md">Enter</button>
          </div>
        </div>
        ))}
        </div>
      }
      <Outlet />

    </div>
  )
}
