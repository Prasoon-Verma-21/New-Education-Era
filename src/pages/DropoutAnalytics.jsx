const DropoutAnalytics = () => {
    return (
        <div className="p-20">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Dropout Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-blue-800">Total Student Risk</h3>
                    <p className="text-3xl font-bold">12%</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-bold text-green-800">Retention Rate</h3>
                    <p className="text-3xl font-bold">88%</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h3 className="font-bold text-red-800">High Risk Cases</h3>
                    <p className="text-3xl font-bold">45</p>
                </div>
            </div>
            <p className="mt-10 text-gray-500 italic text-center">Charts and detailed district-wise data loading from Firestore...</p>
        </div>
    );
};
export default DropoutAnalytics;