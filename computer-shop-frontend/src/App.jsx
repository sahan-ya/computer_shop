import { Route, Routes } from "react-router-dom";
import AdminPage from "./pages/admin";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/profilePage";
import Header from "./components/header"; 

export default function App() {
	return (
		<div className="w-full h-screen bg-primary text-secondary">
			<Toaster position="top-right"/>
			<Routes>
				<Route path="/*" element={<HomePage />} />
				<Route path="/dashboard/*" element={
					<ProtectedRoute>
						<HomePage />
					</ProtectedRoute>
				} />
				<Route path="/admin/*" element={<AdminPage/>}/>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />

				<Route path="/profile" element={
					<ProtectedRoute>
						<Header />
						<ProfilePage />
					</ProtectedRoute>
				} />
			</Routes>
		</div>
	);
}