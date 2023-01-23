
let cards = []
let colors = ['aqua', 'green', 'red', 'blue', 'black', 'yellow']
let selected = []
let selectCount = 0
const slackUrl = 'https://slack.com/api/chat.postMessage', slackAuth = 'xoxb-4595056993570-4676284738837-1OzcQgTfT8oEJ8mGXBAb8dSA', slackChannel = "C04HVLJQUSV"
const dburl = "https://ojgpfyvzsainptwajlci.supabase.co/rest/v1/"
const header = {
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3BmeXZ6c2FpbnB0d2FqbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4MjcxMzAsImV4cCI6MTk3MzQwMzEzMH0.-8ipKols5RVwoxi_g5rxY5Z4tWHC4wDZIaSvjtGfw-g",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3BmeXZ6c2FpbnB0d2FqbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc4MjcxMzAsImV4cCI6MTk3MzQwMzEzMH0.-8ipKols5RVwoxi_g5rxY5Z4tWHC4wDZIaSvjtGfw-g"
}

function jsonToForm(json) {
  var formBody = [];
  for (var property in json) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(json[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody
  }
  
const shuffle = (len) => {
  cards = []
  selected = []
  selectCount = 0
  colors.sort( () => .5 - Math.random() );
  const e = document.getElementById('game')
  // console.log(e)
  var child = e.lastElementChild; 
  while (child) {
      e.removeChild(child);
      child = e.lastElementChild;
  }
  for (let i=0; i<len; ++i) {
    cards.push(Math.floor(Math.random() * (10 - 1 + 1) + 1))
  }
  // console.log(cards)
  let f = 0;
  for (let i=0; i<2; ++i) {
    let cardStr = ''
    for (let j=0; j<3; ++j) {
      cardStr += cardHtml(f++)
    }
    document.getElementById('game').insertAdjacentHTML('beforeend', rowHtml(cardStr))
  }
}

const select = (f) => {
  const el = document.getElementById(`card`+f)
  let ind = undefined
  for (let i=0; i<selected.length; ++i) {
    if (selected[i] === f) ind = i
  }
  // console.log(ind)
  if (ind != undefined) {
    el.style.removeProperty('background-color')
    selected.splice(ind, 1);
  } else {
    if (selected.length === 4) {
      const els = document.getElementById(`card`+selected[0])
      els.style.removeProperty('background-color')
      selected.shift()
    }
    selected.push(f)
    el.style.backgroundColor = 'gray'
    
  }
  // console.log(selected)
}

const submitBtn = async () => {
  if (selected.length < 4) return;
  let shuffledNos = '('
  for (let i=0; i<selected.length; ++i) {
    shuffledNos += "\"" + cards[selected[i]] + "\","
  }

  shuffledNos += ")"

  const resp = await fetch(dburl+'cards?select=*&type=eq.CARDS&status=eq.OPEN&refId=in.'+ shuffledNos, {
    method: 'GET',
    headers: header
  })
  const ress = await resp.json()
  let res = {}
  const cardNums = []
  if (ress.length > 0) {
    for (let i=0; i<ress.length; ++i) {
      res = ress[i]
      // console.log(res)
      cardNums.push(res)
      await fetch(dburl+'cards?id=eq.'+res.id, {
        method: 'PATCH',
        headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
        body: JSON.stringify({...res, status: 'AVAILED'})
      })

    }
  }
  else {
    res = {
      amount: 0,
      num: 'Better Luck Next time',
      pin: ':middle_finger:'
    }
  }

  let msg = '*Selected cards! *\n Here are your gift cards !:tada:\n'
  
  for (let i =0; i<cardNums.length; ++i) {
    msg += "*" + cardNums[i].num + "*/*" + cardNums[i].pin + "*\n"
  }
  await fetch(slackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: jsonToForm({
      "channel": slackChannel,
      "text": msg,
      'token': slackAuth
    })
  })

  document.getElementById('cardGame').style.display = "none"
  await fetch(dburl+'configs?key=eq.state', {
    method: 'PATCH',
    headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
    body: JSON.stringify({value: 'DONE'})
  })
  alert("Done!")

}

const submitPassword = async () => {
  const enteredPassword = document.getElementById('passwordInput').value 
  if (enteredPassword.toUpperCase() === 'SPARSHIMADARCHODHAI') {


    await fetch(dburl+'configs?key=eq.state', {
      method: 'PATCH',
      headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
      body: JSON.stringify({value: 'CARDS'})
    })

    const resp = await fetch(dburl+'cards?select=*&type=eq.PASSWORD&status=eq.OPEN&refId=eq.1', {
      method: 'GET',
      headers: header
    })

    const ress = await resp.json()
    let res = {}
    if (ress.length > 0) {
      res = ress[0]
      await fetch(dburl+'cards?id=eq.'+res.id, {
        method: 'PATCH',
        headers: {...header, "Content-Type": "application/json", "Prefer": "return=minimal"},
        body: JSON.stringify({...res, status: 'AVAILED'})
      })
    }
    else {
      res = {
        amount: 0,
        num: 'Better Luck Next time',
        pin: ':middle_finger:'
      }
    }

    let msg = 'Figured out the password! *\n Here is your gift card of Rs. ' + res.amount + '!:tada:\n*'
      + res.num + "*/*" + res.pin + '*'
    await fetch(slackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: jsonToForm({
        "channel": slackChannel,
        "text": msg,
        'token': slackAuth
      })
    })

    document.getElementById('password').style.display = "none"
    document.getElementById('cardGame').style.removeProperty('display')

  } else {
    alert('try again!')
  }
}

const cardHtml = (f) => {
  const num = cards[f]
  const color = colors[f]
  return `      <div class="card" id="card${f}"onclick=select(${f})>
  <div class="colorbox" style="background-color: ${color};"></div>
  <div class="container">
    <h4><b>${num}</b></h4> 
  </div>
</div>`
}
const rowHtml = (cards) => {
  const start = `<div style="display: flex; align-items: center;">`
  const end = `</div><br><br>`

  return start + cards + end;
}
const run = async () => {
  const confStream = await fetch(dburl+'configs?select=*&key=eq.state', {
    method: 'GET',
    headers: header
  })
  const confArr = await confStream.json()
  if (confArr.length === 0) return;
  const state = confArr[0].value
  if (state === 'CARDS') {
    document.getElementById('password').style.display = "none"
    document.getElementById('cardGame').style.removeProperty('display')
  } else if (state === "DONE") {
    alert('Ho gya bas')
  }

  shuffle(6)
}


run()