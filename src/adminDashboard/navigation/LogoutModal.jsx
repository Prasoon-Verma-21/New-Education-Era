import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import PropTypes from "prop-types";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white dark:bg-slate-900 p-10 rounded-[40px] w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onCancel}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon Area */}
                        <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-6">
                            <LogOut className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
                            Ending Session?
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
                            Are you sure you want to exit the <span className="text-blue-600 dark:text-indigo-400">Unified Portal</span>?
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onConfirm}
                                className="w-full py-4 bg-red-600 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-lg hover:bg-red-700 transition-all active:scale-95"
                            >
                                Terminate Session
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                Go Back
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

LogoutModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default LogoutModal;