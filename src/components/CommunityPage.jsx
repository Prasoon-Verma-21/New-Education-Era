import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useForum } from '../context/CommunityContext';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';


const CommunityPage = () => {
    
    const [newThreadTitle, setNewThreadTitle] = useState("");
    const [newThreadContent, setNewThreadContent] = useState("");
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [newReplyContent, setNewReplyContent] = useState("");
    const [threads, setThreads] = useState()
    const [loading, setLoading] = useState(false);
    const [repLoading, setRepLoading] = useState(false)
    const [upvoteLoading, setUpvoteLoading] = useState({
      replyId: null, 
      flag: false
    })

    const {state} = useLocation();
    const forumId = state?.forumId

    const {fetchCommunities, communities} = useForum()
    const forum = communities?.find((f) => f._id === forumId)

    const handlePostThread = async() => {
      if(newThreadTitle.trim() === "" || newThreadContent.trim() === "") {
          Swal.fire({
            title: 'Required!',
            text: 'Fields are empty',
            icon: 'error',
            confirmButtonText: 'Close',
          })
        return ;
      }

      try {
        const forumId = forum._id
        setLoading(true)
        const response = await axiosInstance.post(`/api/community/${forumId}/threads`, {
          title: newThreadTitle,
          content: newThreadContent,
        });
        console.log("Thread created:", response.data);
        setNewThreadTitle("")
        setNewThreadContent("")
      } catch (error) {
        console.error("Error creating thread:", error.response?.data || error.message);
      } finally {
        setLoading(false)
        fetchCommunities()
      }
    }
  

    const handlePostReply = async(threadId) => {
      try {
        setRepLoading(true)
        const response = await axiosInstance.post(`/api/community/${forumId}/threads/${threadId}/replies`,{
          user: 'currentUser',
          content: newReplyContent
        })
        console.log("replies ",response)
        const updatedThreads = threads.filter((f) => f._id !== threadId)
        setThreads([response.data.thread, ...updatedThreads]);
        setNewReplyContent("");
        // setSelectedThreadId(null);
      } catch (error) {
        console.log("error while replying thread ",error)
      } finally {
        setRepLoading(false)
      }
    };

  
    const handleUpvoteReply = async(threadId, replyId) => {
      // console.log(replyId, forumId, threadId)
      try {
        setUpvoteLoading({
          replyId: replyId,
          flag: true
        })
        const response = await axiosInstance.post('/api/community/upvote-reply', {
          forumId : forumId,
          threadId: threadId, 
          replyId: replyId
        })

        console.log("response of upvote ",response)
        const updatedThreads = threads.filter((f) => f._id !== threadId)
        setThreads([response.data.thread, ...updatedThreads]);

      } catch (error) {
        console.log("error while upvoting reply", error)
      } finally {
        setUpvoteLoading({
          replyId: replyId,
          flag: false
        })
      }
    };


    useEffect(() => {
      setThreads(forum.threads)
    }, [forum])
  
    return (
      <div className="min-h-screen pt-6 px-8 bg-gradient-to-b from-gray-50 via-blue-100 to-white">
        <h1
          className="text-3xl font-semibold text-center text-blue-900 mt-6 mb-6"
          style={{
            textShadow: "0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {forum.name} Community Forum
        </h1>
  
        {/* Post a New Question */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Post a New Question</h2>
          <input
            type="text"
            placeholder="Thread Title"
            required
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            className="border border-gray-300 p-2 w-full mb-2 rounded"
          />
          <textarea
            placeholder="Thread Content"
            value={newThreadContent}
            required
            onChange={(e) => setNewThreadContent(e.target.value)}
            className="border border-gray-300 p-2 w-full mb-4 rounded"
          />
          <button disabled={loading}
            onClick={handlePostThread}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            { loading ? 'Posting...' : 'Post Question'}
          </button>
        </div>
  
        {/* Active Threads */}
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Active Threads</h2>
        {threads && threads?.map((thread, index) => (
          <div key={thread._id} className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <h3 className="text-xl font-medium mb-2">{thread.title}</h3>
            <p className="mb-2">{thread.content}</p>
            <div>
              <button
                onClick={() => {
                  setSelectedThreadId(selectedThreadId === thread._id ? null : thread._id);
                }}
                className="text-blue-600 hover:underline"
              >
                {selectedThreadId === thread._id ? "Hide Replies" : "Show Replies"}
              </button>
            </div>
  
            {selectedThreadId === thread._id && (
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">Replies:</h4>
                {thread.replies.length > 0 ? (
                  thread.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="flex justify-between items-center border-b pb-2 mb-2"
                    >
                      <p className="text-gray-600">
                        {reply.user}: {reply.content}
                      </p>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleUpvoteReply(thread._id, reply._id)}
                          className="text-yellow-500 hover:text-yellow-600 mr-2"
                        >
                          {upvoteLoading.flag === true && upvoteLoading.replyId === reply._id ? <Loader2 className='w-4 h-4 animate-spin justify-center items-center' /> : <p>upvote({reply.upvotes})</p> }
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No replies yet.</p>
                )}
                <textarea
                  placeholder="Write a reply..."
                  value={newReplyContent}
                  onChange={(e) => setNewReplyContent(e.target.value)}
                  className="border border-gray-300 p-2 w-full mb-2 rounded"
                />
                <button disabled={repLoading}
                  onClick={() => handlePostReply(thread._id)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  { loading ? 'Replying...' : 'Reply'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
}

export default CommunityPage