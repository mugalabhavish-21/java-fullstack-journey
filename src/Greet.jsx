export const Greeting = ({
  name = "World",
  message = "Welcome to the React world!",
}) => {
  return (
    <h2>
      {name}, {message}
    </h2>
  );
};