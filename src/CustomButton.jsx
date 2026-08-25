// 1. Receive BOTH text and bookmark as props
export const CustomButton = ({ text }) => {
    const name = "Bhavish Mugala"; // This is a constant value, not a prop
    
    // 2. The handler doesn't need parameters. It can already "see" text and bookmark.
    const handleClick = () => {
        
        return console.log(`Button clicked! Text: ${text}, Name: ${name}`);
    }
    
    // 3. Just pass the function reference directly to onClick
    return ( 
        <button onClick={handleClick}>
            {text}
        </button> 
    );
}