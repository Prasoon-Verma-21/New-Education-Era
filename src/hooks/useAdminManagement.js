import { useState } from 'react';

export const useAdminManagement = (initialAdmins) => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const handleAdd = (adminData) => {
    const newAdmin = {
      ...adminData,
      id: Math.max(...admins.map((a) => a.id), 0) + 1,
    };
    setAdmins([...admins, newAdmin]);
    setIsModalOpen(false);
  };

  const handleEdit = (adminData) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === adminData.id ? adminData : admin
      )
    );
    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setSelectedAdmin(null);
    setIsModalOpen(true);
  };

  const openEditModal = (admin) => {
    setModalMode('edit');
    setSelectedAdmin(admin);
    setIsModalOpen(true);
  };

  return {
    admins,
    selectedAdmin,
    isModalOpen,
    modalMode,
    handleAdd,
    handleEdit,
    handleDelete,
    openAddModal,
    openEditModal,
    setIsModalOpen,
  };
};

export default useAdminManagement;
