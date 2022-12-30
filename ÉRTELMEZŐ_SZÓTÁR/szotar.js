window.state = {
  displayedCards: []
}

function renderCards() {
  let state = window.state
  let cardContainer = window.document.querySelector('#cards')
  cardContainer.innerHTML = ""
  for (let card of state.displayedCards) {
    cardContainer.appendChild(renderCard(card))
  }
}

const TYPES = []
const CARD_TITLE_RE = /^([^⬩]+)\s+([⬩]+)\s*(.*)$/

function _check_all_headers() {
  for (let entry of SZOTAR) { let m = CARD_TITLE_RE.exec(entry.header); if(!m) { console.log(entry) } }
}

function _copy_description_to_clipboard(card) {
  navigator.clipboard.writeText(card.content);
}

function renderCard(card) {
  let cardEl = window.document.createElement('div')
  cardEl.classList.add("sc-card")
  cardEl.id = card.id
  // copy button
  let copyButtonEl = window.document.createElement('button')
  copyButtonEl.classList.add('sc-card-button')
  copyButtonEl.classList.add('sc-card-copy')
  let copyImg = window.document.createElement('img')
  copyImg.setAttribute('src', 'copy.svg')
  copyButtonEl.appendChild(copyImg)
  copyButtonEl.addEventListener('click', () => _copy_description_to_clipboard(card))
  cardEl.appendChild(copyButtonEl)

  // close button
  let closeButtonEl = window.document.createElement('button')
  closeButtonEl.classList.add('sc-card-button')
  closeButtonEl.classList.add('sc-card-close')
  let closeImg = window.document.createElement('img')
  closeImg.setAttribute('src', 'close.svg')
  closeButtonEl.appendChild(closeImg)
  closeButtonEl.addEventListener('click', () => removeCard(card))
  cardEl.appendChild(closeButtonEl)

  // card title
  let cardHeaderEl = window.document.createElement('div')
  cardHeaderEl.classList.add('sc-card-header')
  let m = CARD_TITLE_RE.exec(card.header)
  if (!m) {
    window.DEBUG_TITLE = card.header
    console.error('Could not parse title', card.header)
    let cardTitleEl = window.document.createElement('div')
    cardTitleEl.classList.add('sc-card-title')
    cardTitleEl.textContent = card.header
    cardHeaderEl.appendChild(cardTitleEl)
  } else {
    let cardTitleEl = window.document.createElement('div')
    cardTitleEl.classList.add('sc-card-title')
    cardTitleEl.textContent = m[1]
    let cardFreqEl = window.document.createElement('div')
    cardFreqEl.classList.add('sc-card-freq')
    cardFreqEl.textContent = m[2]
    let cardDetailsEl = window.document.createElement('div')
    cardDetailsEl.classList.add('sc-card-details')
    cardDetailsEl.textContent = m[3]
    cardHeaderEl.appendChild(cardTitleEl)
    cardHeaderEl.appendChild(cardFreqEl)
    cardHeaderEl.appendChild(cardDetailsEl)
  }
  cardEl.appendChild(cardHeaderEl)

  // card body
  let cardBodyEl = window.document.createElement('div')
  cardBodyEl.classList.add('sc-card-body')
  cardBodyEl.innerHTML = card.content.replaceAll("\n", "<br>")
  cardEl.appendChild(cardBodyEl)
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
