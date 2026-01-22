import React from 'react';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminApproval = () => {
  const pendingApprovals = [
    {
      id: 1,
      name: 'David Chen',
      email: 'david@example.com',
      role: 'Admin',
      department: 'Engineering',
      requestDate: '2024-03-15',
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Emily Watson',
      email: 'emily@example.com',
      role: 'SubAdmin',
      department: 'Government',
      requestDate: '2024-03-14',
      status: 'Pending'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      role: 'Admin',
      department: 'Ministry',
      requestDate: '2024-03-13',
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Mike Federal',
      email: 'mike@example.com',
      role: 'SuperAdmin',
      department: 'Education',
      requestDate: '2024-03-13',
      status: 'Pending'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Admin Approval Requests</h1>
        </div>
        <div className="flex space-x-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {pendingApprovals.length} Pending
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full">
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-7 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Applicant</div>
              <div>Role</div>
              <div>Department</div>
              <div>Request Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingApprovals.map((request) => (
              <div key={request.id} className="grid grid-cols-7 px-6 py-4 items-center">
                <div className="col-span-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {request.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{request.name}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-900">{request.role}</div>
                <div className="text-sm text-gray-900">{request.department}</div>
                <div className="text-sm text-gray-900">{request.requestDate}</div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-4 h-4 mr-1" />
                    {request.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApproval;