import React, { useState } from 'react';
import { UserPlus, MoreVertical, Trash2, PencilLine, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const SubAdmins = () => {
  const subAdmins = [
    { id: 1, name: 'Alice Cooper', email: 'alice@example.com', class: '5th', status: 'Active' },
    { id: 2, name: 'Bob Martin', email: 'bob@example.com', class: '6th', status: 'Active' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', class: '11th', status: 'Inactive' },
  ];

  const [subAdminsData, setSubAdminData] = useState(subAdmins)

  const handleAction = (id, message) => {
    const updated = subAdminsData.filter((subadmin) => subadmin.id !== id)
    setSubAdminData(updated)
    Swal.fire({
      title: 'Admin Approval',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <UserPlus className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Sub Administrators</h1>
        </div>
        
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subAdminsData.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {admin.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{admin.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{admin.class}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    admin.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-5">
                    <button onClick={() => handleAction(admin.id, 'Approved')} title='Approve' className="text-blue-500 hover:text-blue-700">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleAction(admin.id, 'Rejected')} title='Reject' className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubAdmins;