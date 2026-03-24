import { Link, useLocation } from "react-router-dom";
import { Home, Target, Heart, Calendar, Gift } from "lucide-react";
import { useGame } from "../context/GameContext";

const BottomNavbar = () => {
    const location = useLocation();
    const { gameState } = useGame();
    const { life } = gameState;

    const isActive = (path) => location.pathname === path;

    const NAV_COLOR = "#111827";

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4">
            <div className="mx-auto max-w-md relative h-24">

                {/* ── Life Circle ── */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20">
                    <div className="relative w-16 h-16 rounded-full p-[3px] bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <div className="w-full h-full rounded-full bg-gray-900 flex flex-col items-center justify-center">
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                            <span className="text-white font-black text-sm leading-none mt-0.5">{life}</span>
                        </div>
                    </div>
                </div>

                {/* ── Navbar background (SVG with smooth notch) ── */}
                <svg
                    className="absolute bottom-0 left-0 w-full"
                    style={{ height: '64px' }}
                    viewBox="0 0 448 64"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d={`
                            M 16,0
                            L 170,0
                            C 185,0 195,36 224,36
                            C 253,36 263,0 278,0
                            L 432,0
                            Q 448,0 448,16
                            L 448,48
                            Q 448,64 432,64
                            L 16,64
                            Q 0,64 0,48
                            L 0,16
                            Q 0,0 16,0
                            Z
                        `}
                        fill={NAV_COLOR}
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                    />
                </svg>

                {/* ── Nav items ── */}
                <div className="absolute bottom-0 left-0 w-full flex items-center z-10" style={{ height: '64px' }}>

                    {/* Inicio */}
                    <NavItem to="/" icon={Home} label="Inicio" active={isActive('/')} />

                    {/* Misiones */}
                    <NavItem to="/missions" icon={Target} label="Misiones" active={isActive('/missions')} />

                    {/* Center spacer */}
                    <div className="w-20 shrink-0" />

                    {/* Recompensas */}
                    <NavItem to="/rewards" icon={Gift} label="Premios" active={isActive('/rewards')} />

                    {/* Historial */}
                    <NavItem to="/calendar" icon={Calendar} label="Historial" active={isActive('/calendar')} />
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
        to={to}
        className={`flex-1 flex flex-col items-center gap-1 py-3 relative no-underline transition-all duration-200
            ${active ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'}`}
    >
        {active && <ActiveIndicator />}
        <Icon className={`w-5 h-5 transition-all duration-200 ${active ? 'scale-110' : ''}`} />
        <span className="text-[9px] font-bold tracking-wider uppercase">{label}</span>
    </Link>
);

const ActiveIndicator = () => (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-amber-400" />
);

export default BottomNavbar;