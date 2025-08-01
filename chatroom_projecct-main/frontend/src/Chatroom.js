import React, { useState, useEffect } from 'react';

const ChatRoom = () => {
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState('');
	const [message, setMessage] = useState('');
	const [file, setFile] = useState(null);


	const fetchMessages = async () => {
		try {
			const response = await fetch('http://localhost:5000/messages');
			const data = await response.json();
			setMessages(data);
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
	};

	const sendMessage = async () => {
		if (!user.trim() || (!message.trim() && !file)) return;

		try {
			const formData = new FormData();
			formData.append("user", user);
			formData.append("message", message);
			if (file) formData.append("photo", file);

			const endpoint = file ? "http://localhost:5000/messages/photo" : "http://localhost:5000/messages";

			await fetch(endpoint, {
				method: "POST",
				body: file ? formData : JSON.stringify({ user, message }),
				headers: file ? {} : { "Content-Type": "application/json" }
			});

			setMessage("");
			setFile(null);
			fetchMessages();
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};


	useEffect(() => {
		// Fetch messages on component mount
		fetchMessages();
		// Poll for new messages every 2 seconds
		const interval = setInterval(() => {
			fetchMessages();
		}, 2000);

		return () => clearInterval(interval);
	}, []); // Run only once on mount

	return (
		<div>
			<h2>Chat Room</h2>
			<ul>
				{messages.map((msg) => (
					<li key={msg._id}>
						<strong>{msg.user}:</strong> {msg.message}
						{msg.imageUrl && (
							<div>
								<img src={msg.imageUrl} alt="uploaded" style={{ width: "200px", marginTop: "5px" }} />
							</div>
						)}
					</li>
				))}

			</ul>
			<div>
				<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />

				<input
					type="text"
					placeholder="Your name"
					value={user}
					onChange={(e) => setUser(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Type your message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
};

export default ChatRoom;