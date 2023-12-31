export async function getAIResult(inputText){
const route = "http://localhost:5260";

let resToken = await fetch(route + "/authentication", {
  method: "POST",
  body: JSON.stringify({
    "userIdentificator": "test",
    "password": "test"
  }),
  headers: {
    "Content-type": "application/json"
  }
});

let token = await resToken.text();

let resText = await fetch(route + "/interactive", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
});

return await resText.json();
}
  