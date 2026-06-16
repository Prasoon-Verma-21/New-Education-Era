const Contact = () => {
    return (
        /* MAIN WRAPPER: Added dark:bg-slate-950 and pt-32 for navbar clearance */
        <div className="min-h-screen p-20 pt-32 text-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

            {/* Header: Added dark:text-indigo-400 and font-black for consistency */}
            <h1 className="text-5xl font-black text-blue-600 dark:text-indigo-400 mb-10 uppercase tracking-tighter">
                Contact Us
            </h1>

            {/* Card: Added dark:bg-slate-900 and dark:border-slate-800 */}
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-2xl dark:shadow-none border border-blue-100 dark:border-slate-800 transition-all">
                <div className="space-y-6">
                    <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">
                        <span className="text-blue-500 dark:text-indigo-400 block text-[10px] uppercase mb-1 tracking-widest">Email</span>
                        support@neweducationera.com
                    </p>

                    <div className="w-12 h-0.5 bg-slate-100 dark:bg-slate-800 mx-auto"></div>

                    <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">
                        <span className="text-blue-500 dark:text-indigo-400 block text-[10px] uppercase mb-1 tracking-widest">Phone</span>
                        +91-98765-43210
                    </p>

                    <div className="w-12 h-0.5 bg-slate-100 dark:bg-slate-800 mx-auto"></div>

                    <p className="text-slate-600 dark:text-slate-400 font-bold text-lg leading-relaxed">
                        <span className="text-blue-500 dark:text-indigo-400 block text-[10px] uppercase mb-1 tracking-widest">Address</span>
                        123 Education Street, <br /> Knowledge City, India
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;