import { Outlet } from "react-router-dom";
import Navbar from "../../components/Guest/Navbar";


export default function GuestLayout() {
    return (
        <div id="app-container" className="bg-gray-100 min-h-screen flex flex-col">
            <Navbar />
            <div id="main-content" className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}