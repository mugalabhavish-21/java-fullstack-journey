import { Greeting } from "./Greet.jsx";
import { CardWrapper } from "./CardWrapper.jsx";
import { NameList } from "./NameList.jsx";
import { CustomButton } from "./CustomButton.jsx";
import { Contact } from "./Contact.jsx";
import { FeedBack } from "./FeedBack.jsx";
import { Menu } from "./Menu.jsx";
import { Counter } from "./Counter.jsx";
import { LoginButton } from "./LoginButton.jsx";
import { UserProfile } from "./UserProfile.jsx";
import { TodoList } from "./TodoList.jsx";
import { CounterWithReducer } from "./CounterwitihReducer.jsx";
import { Shooppingcaart } from "./Shooppingcaart.jsx";
import { useState } from "react";

function App() {
  const [aiResponse, setAiResponse] = useState("");
  const [question, setQuestion] = useState("");

  const askAI = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/ask-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "AI request failed");
      }

      setAiResponse(data.answer);
    } catch (error) {
      console.error("Error:", error);
      setAiResponse("Failed to get AI response.");
    }
  };

  return (
    <div>
      <Shooppingcaart />

    <div>
  <input
    type="text"
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Ask something..."
  />

  <button onClick={askAI}>
    Ask AI
  </button>

  <h2>AI Answer</h2>
  <p>{aiResponse}</p>
</div>

      <Contact />
      <Menu />
      <FeedBack />
      <TodoList />
      <NameList />
      <CounterWithReducer />
      <Counter />
      <LoginButton />
      <UserProfile />

      <CustomButton text="like" />
      <CustomButton text="Bookmark" />

      <Greeting
        name="Alice"
        message="Have a great day!"
      />

      <Greeting
        name="Bob"
        message="Hope you're doing well!"
      />

      <CardWrapper name="Card 1">
        <p>Bhavish</p>
        <p>Bhavish@example.com</p>
        <input
          type="text"
          placeholder="Enter your city"
        />
      </CardWrapper>
    </div>
  );
}

export default App;