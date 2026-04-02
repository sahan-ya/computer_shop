import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	async function login() {
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + "/users/login",
				{ email, password, rememberme: true }
			);
			localStorage.setItem("token", response.data.token);
			toast.success("Login Successful");
			if (response.data.role === "admin") {
				navigate("/admin/");
			} else {
				navigate("/profile");
			}
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to login");
		}
	}

	return (
		<div className="w-full h-screen flex bg-[#f5f5f5] overflow-hidden">

			{/* LEFT PANEL */}
			<div className="hidden lg:flex w-[52%] h-full bg-[#021a54] flex-col justify-between p-12 relative overflow-hidden">

				{/* Glow blobs */}
				<div className="absolute top-[-100px] right-[-100px] w-[420px] h-[420px] rounded-full bg-[#ff85bb] opacity-10 blur-3xl pointer-events-none" />
				<div className="absolute bottom-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full bg-[#ffcee3] opacity-10 blur-3xl pointer-events-none" />

				{/* Brand */}
				<div className="flex items-center gap-3 z-10">
					<img src="/logo.png" className="w-10 h-10 object-contain" />
					<span className="text-[#f5f5f5] text-lg font-bold tracking-wide">Tech Store</span>
				</div>

				{/* Hero text */}
				<div className="z-10">
					<span className="inline-block text-[#ff85bb] text-xs font-medium tracking-[0.15em] uppercase border border-[#ff85bb44] bg-[#ff85bb11] px-4 py-1.5 rounded-full mb-7">
						Welcome back
					</span>
					<h1 className="text-[#f5f5f5] text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
						Your tech,<br />
						<span className="text-[#ff85bb]">perfectly</span><br />
						managed.
					</h1>
					<p className="mt-5 text-[#f5f5f580] text-sm font-light leading-relaxed max-w-sm">
						Sign in to access your dashboard and manage everything in one place.
					</p>
				</div>

				{/* Footer */}
				<div className="z-10 flex items-center gap-2.5">
					<div className="w-1.5 h-1.5 rounded-full bg-[#ff85bb]" />
					<span className="text-[#f5f5f540] text-xs">Secure · Reliable · Always on</span>
				</div>

				{/* Bottom accent stripe */}
				<div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff85bb] via-[#ffcee3] to-[#ff85bb]" />
			</div>

			{/* RIGHT PANEL */}
			<div className="w-full lg:w-[48%] h-full flex items-center justify-center px-8">
				<div className="w-full max-w-sm">

					{/* Mobile brand */}
					<div className="flex lg:hidden flex-col items-center mb-8">
						<img src="/logo.png" className="w-14 mb-2" />
						<span className="text-[#021a54] text-lg font-bold tracking-wide">Tech Store</span>
					</div>

					{/* Card header */}
					<div className="mb-8">
						<h2 className="text-[#021a54] text-3xl font-bold tracking-tight">Sign in</h2>
						<p className="text-[#021a5470] text-sm font-light mt-1">Enter your credentials to continue</p>
					</div>

					{/* Email */}
					<div className="mb-5">
						<label className="block text-[#021a54] text-[10px] font-medium tracking-[0.12em] uppercase mb-2">
							Email Address
						</label>
						<input
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full h-[52px] px-4 rounded-xl border border-[#021a5420] bg-white text-[#021a54] text-sm placeholder-[#021a5440] outline-none focus:border-[#ff85bb] focus:ring-4 focus:ring-[#ffcee360] transition-all"
						/>
					</div>

					{/* Password */}
					<div className="mb-3">
						<label className="block text-[#021a54] text-[10px] font-medium tracking-[0.12em] uppercase mb-2">
							Password
						</label>
						<input
							type="password"
							placeholder="••••••••"
							onChange={(e) => setPassword(e.target.value)}
							className="w-full h-[52px] px-4 rounded-xl border border-[#021a5420] bg-white text-[#021a54] text-sm placeholder-[#021a5440] outline-none focus:border-[#ff85bb] focus:ring-4 focus:ring-[#ffcee360] transition-all"
						/>
					</div>

					{/* Forgot password */}
					<div className="flex justify-end mb-6">
						<Link to="/forgot-password" className="text-[#ff85bb] text-xs font-medium hover:text-[#021a54] transition-colors">
							Forgot password?
						</Link>
					</div>

					{/* Login button */}
					<button
						onClick={login}
						className="w-full h-[52px] bg-[#021a54] text-[#f5f5f5] rounded-xl text-sm font-medium tracking-wide hover:bg-[#0a2b6e] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#021a5430] active:translate-y-0 transition-all mb-3"
					>
						Sign in
					</button>

					{/* Divider */}
					<div className="flex items-center gap-3 my-5">
						<div className="flex-1 h-px bg-[#021a5415]" />
						<span className="text-[#021a5440] text-[10px] font-light tracking-widest uppercase">or</span>
						<div className="flex-1 h-px bg-[#021a5415]" />
					</div>

					{/* Google button */}
					<GoogleLogin
  onSuccess={async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/users/google-login",
        {
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        }
      );

      localStorage.setItem("token", res.data.token);
      toast.success("Google Login Successful");

      if (res.data.role === "admin") {
        navigate("/admin/");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      toast.error("Google login failed");
    }
  }}
  onError={() => {
    toast.error("Google Sign-In Failed");
  }}
/>

					{/* Sign up */}
					<p className="text-center text-[#021a5470] text-sm">
						Don't have an account?{" "}
						<Link to="/register" className="text-[#ff85bb] font-medium hover:text-[#021a54] transition-colors">
							Create one
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}