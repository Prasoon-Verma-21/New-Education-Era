import React from 'react';
import { Users, MoreVertical, Trash2, PencilLine } from 'lucide-react';

const Parents = () => {
    const parents = [
        { id: 1, name: 'Robert Wilson', email: 'robert@example.com', stuId: '1', stuName: 'Ayush', college: 'LPS SouthCity', status: 'Active' },
        { id: 2, name: 'Sarah Brown', email: 'sarah@example.com', stuId: '2', stuName: 'Narendra', college: 'Army Public School', status: 'Active' },
        { id: 3, name: 'Tom Davis', email: 'tom@example.com', stuId: '3', stuName: 'Adarsh', college: 'Amity Internationals', status: 'Inactive' },
        { id: 4, name: 'Emma Johnson', email: 'emma@example.com', stuId: '4', stuName: 'Priya', college: 'DPS Noida', status: 'Pending' },
        { id: 5, name: 'John Smith', email: 'john@example.com', stuId: '5', stuName: 'Rahul', college: 'Kendriya Vidyalaya', status: 'Active' },
        { id: 6, name: 'Lucas White', email: 'lucas@example.com', stuId: '6', stuName: 'Ishita', college: 'Lotus Valley', status: 'Inactive' },
        { id: 7, name: 'Olivia Taylor', email: 'olivia@example.com', stuId: '7', stuName: 'Arjun', college: 'St. Xavier’s', status: 'Active' },
        { id: 8, name: 'James Green', email: 'james@example.com', stuId: '8', stuName: 'Simran', college: 'The Heritage School', status: 'Inactive' },
        { id: 9, name: 'Sophia Miller', email: 'sophia@example.com', stuId: '9', stuName: 'Aditi', college: 'Ryan International', status: 'Active' },
        { id: 10, name: 'Liam Martin', email: 'liam@example.com', stuId: '10', stuName: 'Karan', college: 'Mount Carmel', status: 'Pending' },
        { id: 11, name: 'Charlotte Lee', email: 'charlotte@example.com', stuId: '11', stuName: 'Sneha', college: 'Gems International', status: 'Active' },
        { id: 12, name: 'Ethan Walker', email: 'ethan@example.com', stuId: '12', stuName: 'Vikram', college: 'Springfield School', status: 'Inactive' },
        { id: 13, name: 'Amelia Scott', email: 'amelia@example.com', stuId: '13', stuName: 'Ananya', college: 'Oakridge International', status: 'Active' },
        { id: 14, name: 'Mason Harris', email: 'mason@example.com', stuId: '14', stuName: 'Kabir', college: 'Delhi Public School', status: 'Pending' },
        { id: 15, name: 'Isabella Thompson', email: 'isabella@example.com', stuId: '15', stuName: 'Rohan', college: 'Cambridge School', status: 'Active' }
      ];
      

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Parents</h1>
        </div>
       
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Unique ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parents.map((parent) => (
              <tr key={parent.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {parent.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{parent.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{parent.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{parent.stuId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{parent.stuName}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{parent.college}</div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    parent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {parent.status}
                  </span>
                </td> */}
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <button className="text-blue-500 hover:text-blue-700">
                      <PencilLine className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Parents;