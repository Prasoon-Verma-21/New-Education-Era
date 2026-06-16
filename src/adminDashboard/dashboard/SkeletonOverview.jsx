import React from "react";

const SkeletonOverview = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 w-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 w-48 rounded-lg"></div>
            </div>

            {/* Stat Cards Skeleton Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-slate-900 p-6 rounded-[35px] border dark:border-slate-800 shadow-sm relative overflow-hidden h-[180px] flex flex-col justify-between"
                    >
                        {/* Colored side bar placeholder */}
                        <div className="absolute top-0 right-0 w-2 h-full bg-slate-200 dark:bg-slate-700" />

                        {/* Icon placeholder */}
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>

                        <div>
                            {/* Label placeholder */}
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 w-24 rounded-lg mb-3"></div>
                            {/* Big Number placeholder */}
                            <div className="h-12 bg-slate-200 dark:bg-slate-800 w-32 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section Skeleton */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-md mt-6 border border-slate-100 dark:border-slate-800 h-[400px]">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 w-48 rounded-lg mb-8"></div>
                <div className="h-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl"></div>
            </div>
        </div>
    );
};

export default SkeletonOverview;