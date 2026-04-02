import axios from "axios";
import { useEffect, useState } from "react";
import uploadFile from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [existingImageUrl, setExistingImageUrl] = useState("");
	const [file, setFile] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");

		//if (!token) {
			//navigate("/login");
			//return;
		//}

		axios
			.get(import.meta.env.VITE_API_URL + "/users/profile", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setFirstName(response.data.firstName);
				setLastName(response.data.lastName);
				setExistingImageUrl(response.data.image);
			})
			.catch((error) => {
				console.log("PROFILE ERROR:", error);
console.log("API error:", error);
  toast.error("Something went wrong");
				//localStorage.removeItem("token");
				//navigate("/login");
			});
	}, [navigate]);

	async function updateProfile() {
		try {
			const token = localStorage.getItem("token");

			let imageUrl = existingImageUrl;

			if (file != null) {
				imageUrl = await uploadFile(file);
			}

			const response = await axios.put(
				import.meta.env.VITE_API_URL + "/users/",
				{
					firstName,
					lastName,
					image: imageUrl,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			localStorage.setItem("token", response.data.token);
			toast.success("Profile updated successfully");
		} catch (err) {
			toast.error("Failed to update profile");
			console.log(err);
		}
	}

	async function changePassword() {
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		try {
			const token = localStorage.getItem("token");

			await axios.post(
				import.meta.env.VITE_API_URL + "/users/update-password",
				{
					password,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			toast.success("Password changed successfully");
		} catch (err) {
			toast.error("Failed to change password");
			console.log(err);
		}
	}

	return (
		<div className="w-full min-h-[calc(100vh-100px)] flex justify-center items-center px-4 py-8">
			<div className="w-full flex flex-col lg:flex-row gap-6 justify-center ">
				
				{/* PROFILE */}
				<div className="min-w-[300px] rounded-lg bg-white shadow-md p-6 flex flex-col gap-4">
					<h1 className="text-2xl font-bold text-accent text-center">
						Account Settings
					</h1>

					<input
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="First Name"
					/>

					<input
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="Last Name"
					/>

					<input
						type="file"
						onChange={(e) => setFile(e.target.files[0])}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
					/>

					<button
						className="w-full h-[50px] bg-accent text-white rounded-lg mt-2"
						onClick={updateProfile}
					>
						Update Profile
					</button>
				</div>

				{/* PASSWORD */}
				<div className="min-w-[300px] rounded-lg bg-white shadow-md p-6 flex flex-col gap-4">
					<h1 className="text-2xl font-bold text-accent text-center">
						Change Password
					</h1>

					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="New Password"
					/>

					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full h-[50px] p-3 border border-secondary rounded-lg"
						placeholder="Confirm New Password"
					/>

					<button
						className="w-full h-[50px] bg-accent text-white rounded-lg mt-2"
						onClick={changePassword}
					>
						Change Password
					</button>
				</div>

			</div>
		</div>
	);
}