import React from 'react';
import { Shield, MoreVertical, Trash2, PencilLine } from 'lucide-react';
import useAdminManagement from '../../hooks/useAdminManagement';
import AdminModal from '../shared/AdminModal';
import AdminForm from '../shared/AdminForm';
// import AdminModal from '../shared/AdminModal';
// import AdminForm from '../shared/AdminForm';
// import useAdminManagement from '../../hooks/useAdminManagement';

const initialSuperAdmins = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Super Admin', status: 'Active' }
];

const SuperAdmins = () => {
  const {
    admins,
    selectedAdmin,
    isModalOpen,
    modalMode,
    handleAdd,
    handleEdit,
    handleDelete,
    openAddModal,
    openEditModal,
    setIsModalOpen
  } = useAdminManagement(initialSuperAdmins);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Super Administrators</h1>
        </div>
       
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
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
                  <div className="text-sm text-gray-900">{admin.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    admin.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => openEditModal(admin)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilLine className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(admin.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add Super Admin' : 'Edit Super Admin'}
      >
        <AdminForm
          type="super"
          onSubmit={modalMode === 'add' ? handleAdd : handleEdit}
          initialData={selectedAdmin || undefined}
        />
      </AdminModal>
    </div>
  );
};

export default SuperAdmins; 