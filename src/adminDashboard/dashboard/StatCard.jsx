import PropTypes from 'prop-types';

const StatCard = ({ title, value, icon: Icon, color, onMoreInfo }) => {
    return (
        <div className={`relative overflow-hidden p-6 rounded-[30px] shadow-md transition-all duration-300 group ${color}`}>
            <div className="relative z-10 flex flex-col h-full text-white">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{title}</p>
                    <p className="text-4xl font-black text-white uppercase tracking-tighter">{value}</p>
                </div>
                <button
                    onClick={onMoreInfo}
                    className="mt-6 flex items-center text-[10px] font-black text-white uppercase tracking-widest hover:translate-x-1 transition-transform outline-none"
                >
                    More info <span className="ml-1 text-xs">›</span>
                </button>
            </div>
        </div>
    );
};

// --- ADDED PROP TYPES VALIDATION ---
StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    onMoreInfo: PropTypes.func.isRequired,
};

export default StatCard;