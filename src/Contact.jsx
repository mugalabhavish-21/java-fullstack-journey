import { ActionButton } from "./ActionButton.jsx";

export const Contact = () => {
    const handleSubmit = () => {
        alert("Form submitted!");
    }
  return (
    <div>
      <h1>Contact Us</h1>
      <p>If you have any questions, feel free to reach out to us!</p>
      <p>Email: contact@example.com</p>
      <ActionButton text="Get in Touch" onClick={handleSubmit} />
    </div>
  );
};
