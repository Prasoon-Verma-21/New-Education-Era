import React, { useState } from 'react';
import Dashboard from './dashboard/Dashboard';
import SuperAdmins from './admin/SuperAdmins';
import Admins from './admin/Admins';
import SubAdmins from './admin/SubAdmins';
import AdminApproval from './admin/AdminApproval';
import Parents from './admin/Parents';
import Students from './admin/Students';
import SideNav from './navigation/SideNav';


function Admin() { // Changed App to Admin
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'superadmins': return <SuperAdmins />;
      case 'admins': return <Admins />;
      case 'subadmins': return <SubAdmins />;
      case 'admin-approval': return <AdminApproval />;
      case 'parents': return <Parents />;
      case 'students': return <Students />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SideNav onPageChange={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 ">
        {renderPage()}
      </div>
    </div>
  );
}

export default Admin; // Changed App to Admin

