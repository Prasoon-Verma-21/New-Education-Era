import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Trash2, Edit3, Search, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import SkeletonRegistry from "./SkeletonRegistry";

const DistrictOfficials = () => {
    const [officials, setOfficials] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const q = query(collection(db, "users"), where("role", "==", "district_official"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Alphabetical Sort Logic
            const sortedData = fetchedData.sort((a, b) => {
                const nameA = (a.name || "").toLowerCase();
                const nameB = (b.name || "").toLowerCase();
                return nameA.localeCompare(nameB);
            });

            setOfficials(sortedData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "users", editingUser.id), { ...editingUser });
            setEditingUser(null);
            Swal.fire('Updated!', 'District assignments updated.', 'success');
        } catch (err) { Swal.fire('Error', err.message, 'error'); }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({ title: 'Remove Official?', text: `Delete ${name}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
        if (result.isConfirmed) { await deleteDoc(doc(db, "users", id)); Swal.fire('Deleted!', 'Official removed.', 'success'); }
    };

    const filtered = officials.filter(o => (o.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (o.email || "").toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <SkeletonRegistry />;

    return (
        <div className="p-10 bg-white dark:bg-slate-900 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl"><MapPin className="text-rose-600" /></div>
                    <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">District Official Registry</h2>
                </div>
                <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search Officials..." className="w-full p-3 pl-12 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="border dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm">
                <table className="w-full text-left font-bold">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] text-slate-400 uppercase tracking-widest">
                    <tr><th className="p-6">Official</th><th className="p-6">Email</th><th className="p-6">Mobile</th><th className="p-6">Assigned District</th><th className="p-6 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                    {filtered.map(o => (
                        <tr key={o.id} className="text-sm dark:text-slate-300">
                            <td className="p-6 uppercase text-slate-800 dark:text-white">{o.name}</td>
                            <td className="p-6 text-slate-500">{o.email}</td>
                            <td className="p-6 text-slate-500">{o.phone}</td>
                            <td className="p-6 text-rose-600 font-black uppercase tracking-widest">{o.district}</td>
                            <td className="p-6 text-right flex justify-end gap-2">
                                <button onClick={() => setEditingUser(o)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(o.id, o.name)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {editingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black uppercase dark:text-white">Edit Official</h3>
                                <button onClick={() => setEditingUser(null)}><X className="dark:text-white" /></button>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <input className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} placeholder="Name" />
                                <input className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white" value={editingUser.phone} onChange={e => setEditingUser({...editingUser, phone: e.target.value})} placeholder="Mobile" />
                                <input className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold dark:text-white uppercase" value={editingUser.district} onChange={e => setEditingUser({...editingUser, district: e.target.value})} placeholder="District" />
                                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black uppercase text-xs rounded-2xl shadow-lg mt-4">Save Changes</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DistrictOfficials;