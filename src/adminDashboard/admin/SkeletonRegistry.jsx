const SkeletonRegistry = () => {
    return (
        <div className="p-10 bg-white dark:bg-slate-900 min-h-screen animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                </div>
                <div className="w-80 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            </div>

            {/* Table Skeleton */}
            <div className="border dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm">
                <div className="h-16 bg-slate-100 dark:bg-slate-800/50 w-full mb-1"></div>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex border-t dark:border-slate-800 p-6 space-x-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonRegistry;