import { ActionButton } from "./ActionButton.jsx";

export const FeedBack = () => {
    const handleSubmit = () => {
        alert("Feedback submitted!");
    }
  return (
    <div>
      <h1>Feedback</h1>
      <p>We value your feedback! Please let us know your thoughts.</p>
      <p>Email: feedback@example.com</p>
      <ActionButton text="Submit Feedback" onClick={handleSubmit} />
    </div>
  );
};
