import { useState, useEffect } from 'react'; // Removed unused React import
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Dashboard from './dashboard/Dashboard';
import Admins from './admin/Admins';
import SubAdmins from './admin/SubAdmins';
import Parents from './admin/Parents';
import Students from './admin/Students';
import DistrictOfficials from './admin/DistrictOfficials';
import SideNav from './navigation/SideNav';
import { useAuth } from "../context/AuthContext";
import DropoutAnalytics from '../pages/DropoutAnalytics'; // Your existing component

function Admin() {
    const { userData } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    // FIXED: This function MUST stay inside the Admin component to access the states above
    const renderPage = () => {
        if (!userData) return null;

        switch (currentPage) {
            case 'dashboard':
                return <Dashboard onPageChange={setCurrentPage} allUsers={allUsers} />;

            case 'analytics':
                // This triggers your "Class Risk Intelligence" page
                return <DropoutAnalytics onBack={() => setCurrentPage('dashboard')} />;

            case 'admins': return <Admins />;
            case 'subadmins': return <SubAdmins />;
            case 'parents': return <Parents />;
            case 'students': return <Students />;
            case 'district_officials': return <DistrictOfficials />;
            default:
                return <Dashboard onPageChange={setCurrentPage} allUsers={allUsers} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex transition-colors duration-300">
            <SideNav onPageChange={setCurrentPage} currentPage={currentPage} />
            <div className="flex-1 ml-64 min-h-screen bg-gray-50 dark:bg-slate-950 overflow-x-hidden">
                {renderPage()}
            </div>
        </div>
    );
}

export default Admin;