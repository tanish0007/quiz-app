const user = JSON.parse(sessionStorage.getItem('user'));
if(!user){
    window.location.href = 'index.html';
}

document.querySelector('.user-name').innerHTML = user.username;
document.querySelector('.user-age').innerHTML = user.age;

let results = [];

const userResult = JSON.parse(sessionStorage.getItem('results'));
console.log(userResult);

async function verifyAns(quesId, answer){
    try{
        const res = await fetch('http://localhost:8080/verify',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "queId": quesId,
                "ans": answer
            })
        });
        const data = await res.json();
        return data.isCorrect;
        console.log(data);
    } catch(err) {
        console.log(err);
    }
}

let result = [];
document.addEventListener('DOMContentLoaded', async () => {
    for(let i=0; i<userResult.length; i++){
        let obj = {
            id: userResult[i].id,
            isCorrect: await verifyAns(userResult[i].id, userResult[i].answer)
        }
        result.push(obj);
    }

    for(let i=0; i<userResult.length; i++){
        <h1></h1>
    }

    console.log(result);
})
