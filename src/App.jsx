import { Greeting } from "./Greet.jsx";
import { CardWrapper } from "./CardWrapper.jsx";
import { NameList } from "./NameList.jsx";
import { CustomButton } from "./CustomButton.jsx";
import { Contact } from "./Contact.jsx";
import { FeedBack } from "./FeedBack.jsx"; 
import { Menu } from "./Menu.jsx";// Fixed casing match
import {Counter} from "./Counter.jsx";
import { LoginButton } from "./LoginButton.jsx"; // Added import for Counter component
import{UserProfile} from "./UserProfile.jsx"; 
import { TodoList } from "./TodoList.jsx";
import { CounterWithReducer } from "./CounterwitihReducer.jsx";// Added import for UserProfile component
import { Shooppingcaart } from "./Shooppingcaart.jsx";
function App() {
  return (
    <div>
      <Shooppingcaart />
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
        <input type="text" placeholder="Enter your city" />
      </CardWrapper>
    </div>
  );
}

export default App;
