const button = () => {
  return (
    <button style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' ,width:'100px',height:'50px',alignItems:'center',justifyContent:'center' }}>
      click me
    </button>
  );

}
const display = () => {
  return (
    <>
    <h1>I love to code</h1>
    <p>it my passion </p>
    </>
  )
}
export default button;
export { display };