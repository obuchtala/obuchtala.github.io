window.state = {
  displayedCards: []
}

function renderCards() {
  let state = window.state
  let cardContainer = window.document.querySelector('#content')
  cardContainer.innerHTML = ""
  for (let card of state.displayedCards) {
    cardContainer.appendChild(renderCard(card))
  }
}

function renderCard(card) {
  let cardEl = window.document.createElement('div')
  cardEl.classList.add("card")
  cardEl.id = card.id
  // close button
  let closeButtonEl = window.document.createElement('button')
  closeButtonEl.classList.add('card-close')
  closeButtonEl.textContent = 'X'
  closeButtonEl.addEventListener('click', () => removeCard(card))
  cardEl.appendChild(closeButtonEl)
  // card header
  let cardHeaderEl = window.document.createElement('div')
  cardHeaderEl.classList.add('card-header')
  cardHeaderEl.textContent = card.header
  cardEl.appendChild(cardHeaderEl)
  // card content
  let cardContentEl = window.document.createElement('div')
  cardContentEl.classList.add('card-content')
  cardContentEl.innerHTML = card.content.replaceAll("\n", "<br>")
  cardEl.appendChild(cardContentEl)
  return cardEl
}

function removeCard(card) {
  let displayedCards = window.state.displayedCards
  let index = displayedCards.findIndex(item => item.id === card.id)
  if (index > -1) {
    displayedCards.splice(index, 1)
    renderCards()
  }
}

function addCards(title) {
  let displayedCards = window.state.displayedCards
  let displacedIds = new Set(displayedCards.map(card => card.id))
  let newCards = window.SZOTAR.filter(card => {
    return (card.title === title && !displacedIds.has(card.id))
  })
  if (newCards.length > 0) {
    displayedCards.unshift(...newCards)
    renderCards()
  }
}

function initSearch() {
  let keysEl = window.document.querySelector("#szotar_keys")
  keysEl.innerHTML = ""
  let uniqKeys = new Set()
  for (let entry of window.SZOTAR) {
    uniqKeys.add(entry.title)
  }
  for (let key of uniqKeys) {
    let optionEl = window.document.createElement('option')
    optionEl.value = key
    keysEl.appendChild(optionEl)
  }
}

function handleSearch() {
  let searchEl = window.document.querySelector('#search')
  const key = searchEl.value
  addCards(key)
  searchEl.value = ""
}

window.addEventListener("load", () => {
  initSearch()
  // let searchEl = window.document.querySelector('#search')
  // searchEl.addEventListener('change', handleSearch)
})
