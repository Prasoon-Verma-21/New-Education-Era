import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Teacher'); // Default role

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // 1. Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Save the Role in Firestore under the same UID
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: role // 'Teacher', 'Headmaster', or 'District Official'
            });

            alert("Profile created Successfully as !"+role);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto bg-white shadow-xl rounded-2xl mt-20 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Create Profile</h2>
            <form onSubmit={handleSignup} className="space-y-4">
                <input type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="w-full p-2 border rounded" onChange={(e) => setPassword(e.target.value)} required />

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Select Your Role:</label>
                    <select className="w-full p-2 border rounded bg-gray-50" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Teacher">Teacher</option>
                        <option value="Headmaster">School Headmaster</option>
                        <option value="District Official">District/State Official</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded-lg font-bold hover:bg-blue-800 transition-all">
                    Register to New Education Era
                </button>
            </form>
        </div>
    );
};

export default Signup;