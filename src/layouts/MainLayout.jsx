import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

export default function MainLayout(){
    return (
        <div className="main-layout">
            <Nav />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
