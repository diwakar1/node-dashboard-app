import React from "react";
import { useState, useEffect } from "react";
const Profile = () => {
	const [user, setUser] = useState(null);
	const dummyImage = "https://www.w3schools.com/w3images/avatar2.png";

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []);

	if (!user) {
		return <div>Loading ...</div>;
	}
	return (
		<div style={styles.profileContainer}>
		<h2 style={styles.heading}>Profile</h2>
			<div style={styles.imageContainer}>
				<img src={dummyImage} alt="User Avatar" style={styles.avatar} />
			</div>
			<div style={styles.profileDetails}>
				<div style={styles.detailItem}>
					<strong>Name:</strong> {user.name}
				</div>
				<div style={styles.detailItem}>
					<strong>Email:</strong> {user.email}
				</div>
			</div>
		</div>
	);
};

const styles = {
	profileContainer: {
		padding: "1rem",
		maxWidth: "400px",
		marginTop: "1rem",
		marginLeft: "1rem",
		borderRadius: "8px",
	},
	imageContainer: {
		marginBottom: "15px", 
	},
	avatar: {
		width: "120px", 
		height: "120px",
		borderRadius: "50%", 
		objectFit: "cover", 
	},
	heading: {
		fontSize: "24px",
		color: "#333",
		fontWeight: "20px",
		marginBottom: "20px",
	},
	profileDetails: {
		marginTop: "15px",
		textAlign: "left"
	},
	detailItem: {
		marginBottom: "10px",
		fontSize: "16px",
		color: "#555",
	},
};

export default Profile;
