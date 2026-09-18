const URL = "https://cat-fact.herokuapp.com/facts";
let getresponse = async()=>{
    let promise = await fetch(URL);
    console.log(promise)

}