import { useState } from 'react';

export default function ContactForm() {
	const [form, setForm] = useState({ name: '', email: '', message: '' });
	const [sent, setSent] = useState(false);

	const handleChange = ({ target }) => {
		setForm((current) => ({ ...current, [target.name]: target.value }));
		setSent(false);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setSent(true);
		setForm({ name: '', email: '', message: '' });
	};

	return (
		<section
			style={{
				maxWidth: 520,
				margin: '2rem auto',
				padding: '2rem',
				borderRadius: 20,
				background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
				boxShadow: '0 12px 30px rgba(120, 53, 15, 0.15)',
				fontFamily: 'system-ui, sans-serif',
			}}
		>
			<h2 style={{ marginTop: 0, color: '#9a3412' }}>Let&apos;s chat! ✨</h2>
			<p style={{ color: '#7c2d12' }}>Have a question or a bright idea? Send it my way.</p>

			<form onSubmit={handleSubmit}>
				<label htmlFor="name">Name</label>
				<input
					id="name"
					name="name"
					value={form.name}
					onChange={handleChange}
					placeholder="Your name"
					required
					style={inputStyle}
				/>

				<label htmlFor="email">Email</label>
				<input
					id="email"
					type="email"
					name="email"
					value={form.email}
					onChange={handleChange}
					placeholder="you@example.com"
					required
					style={inputStyle}
				/>

				<label htmlFor="message">Message</label>
				<textarea
					id="message"
					name="message"
					value={form.message}
					onChange={handleChange}
					placeholder="Tell me what’s on your mind..."
					rows="5"
					required
					style={{ ...inputStyle, resize: 'vertical' }}
				/>

				<button
					type="submit"
					style={{
						width: '100%',
						padding: '0.8rem',
						border: 0,
						borderRadius: 12,
						background: '#ea580c',
						color: 'white',
						fontSize: '1rem',
						fontWeight: 700,
						cursor: 'pointer',
					}}
				>
					Send message 🚀
				</button>
			</form>

			{sent && <p style={{ color: '#166534', fontWeight: 600 }}>Thanks! Your message is on its way. 🎉</p>}
		</section>
	);
}

const inputStyle = {
	display: 'block',
	width: '100%',
	boxSizing: 'border-box',
	margin: '0.4rem 0 1rem',
	padding: '0.75rem',
	border: '2px solid #fed7aa',
	borderRadius: 10,
	fontSize: '1rem',
};
