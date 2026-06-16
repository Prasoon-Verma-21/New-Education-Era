import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Trash2, Edit3, Search, X, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import SkeletonRegistry from "./SkeletonRegistry";

const SubAdmins = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "teacher"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Alphabetical Sort Logic
      const sortedData = fetchedData.sort((a, b) => {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });

      setTeachers(sortedData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Confirm Delete?',
      text: `Are you sure you want to remove ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "users", id));
        Swal.fire('Deleted!', 'Teacher removed from system.', 'success');
      } catch (err) { Swal.fire('Error', err.message, 'error'); }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", editingUser.id);
      // We spread the entire editingUser object to save all modified fields
      await updateDoc(userRef, { ...editingUser });
      setEditingUser(null);
      Swal.fire('Updated!', 'Teacher registry has been synced.', 'success');
    } catch (err) { Swal.fire('Error', err.message, 'error'); }
  };

  const filteredData = teachers.filter(t =>
      (t.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <SkeletonRegistry />;

  return (
      <div className="p-10 bg-white dark:bg-slate-900 min-h-screen">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl"><GraduationCap className="text-indigo-600" /></div>
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Teacher Registry</h2>
          </div>

          {/* SEARCH BOX */}
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="text" placeholder="Search Teachers..."
                className="w-full p-3 pl-12 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none border border-transparent focus:border-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm">
          <table className="w-full text-left font-bold">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="p-6">Name</th>
              <th className="p-6">Email</th>
              <th className="p-6">Class</th>
              <th className="p-6">School</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
            {filteredData.map(t => (
                <tr key={t.id} className="text-sm dark:text-slate-300">
                  <td className="p-6 uppercase text-slate-800 dark:text-white">{t.name}</td>
                  <td className="p-6 text-slate-500">{t.email}</td>
                  <td className="p-6 text-indigo-600 uppercase">{t.assignedClass}</td>
                  <td className="p-6 text-slate-400">{t.school}</td>
                  <td className="p-6 text-right flex justify-end gap-2">
                    {/* EDIT & DELETE BUTTONS */}
                    <button onClick={() => setEditingUser(t)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id, t.name)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* EDIT MODAL */}
        <AnimatePresence>
          {editingUser && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black uppercase dark:text-white">Update Teacher Profile</h3>
                    <button onClick={() => setEditingUser(null)}><X className="dark:text-white" /></button>
                  </div>
                  <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                      <input className="w-full p-4 mt-1 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mobile</label>
                      <input className="w-full p-4 mt-1 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" value={editingUser.phone} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assigned Class</label>
                      <input className="w-full p-4 mt-1 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" value={editingUser.assignedClass} onChange={e => setEditingUser({...editingUser, assignedClass: e.target.value})} />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Affiliated School</label>
                      <input className="w-full p-4 mt-1 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" value={editingUser.school} onChange={e => setEditingUser({...editingUser, school: e.target.value})} />
                    </div>

                    <button type="submit" className="col-span-2 py-4 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl shadow-lg mt-4 hover:bg-blue-700 transition-all">
                      Commit Changes to Registry
                    </button>
                  </form>
                </motion.div>
              </div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default SubAdmins;