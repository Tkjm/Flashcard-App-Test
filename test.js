let changeFlashCardsSizeButton
let importButton
let exportButton
let importExportTextarea
let contentDiv
let customSpanNextButton
let decreaseSpanNextButton
let remainSpanNextButton
let increaseSpanNextButton

let currentReviewTimes = 1
let selectedFlashCard
let flashCards = []




// Functions

function initialize() {
  changeFlashCardsSizeButton = document.querySelector('.changeFlashCardsSizeButton')
  importButton = document.querySelector('.importButton')
  exportButton = document.querySelector('.exportButton')
  importExportTextarea = document.querySelector('.importExportTextarea')
  contentDiv = document.querySelector('.contentDiv')
  customSpanNextButton = document.querySelector('.customSpanNextButton')
  decreaseSpanNextButton = document.querySelector('.decreaseSpanNextButton')
  remainSpanNextButton = document.querySelector('.remainSpanNextButton')
  increaseSpanNextButton = document.querySelector('.increaseSpanNextButton')
  changeFlashCardsSizeButton.addEventListener('click', onChangeFlashCardsSizeButtonClick)
  importButton.addEventListener('click', onImportButtonClick)
  exportButton.addEventListener('click', onExportButtonClick)
  contentDiv.addEventListener('input', onContentDivInput)
  customSpanNextButton.addEventListener('click', onCustomSpanNextButtonClick)
  decreaseSpanNextButton.addEventListener('click', onDecreaseSpanNextButtonClick)
  remainSpanNextButton.addEventListener('click', onRemainSpanNextButtonClick)
  increaseSpanNextButton.addEventListener('click', onIncreaseSpanNextButtonClick)
  for (let i = 1; i <= 10000; i++) {
    let flashCard = new FlashCard(i.toString(), i)
    flashCards.push(flashCard)
  }
  selectFlashCard(flashCards[0])
}

function selectNextFlashCard() {
  selectedFlashCard.lastReview = currentReviewTimes
  currentReviewTimes++
  flashCards.sort((a, b) => {
    let returnValue = getPriority(b, currentReviewTimes) - getPriority(a, currentReviewTimes)
    if (Math.abs(returnValue) <= 0.0001) {
      if (a.id < b.id) {
        returnValue = -1
      } else {
        returnValue = 1
      }
    }
    return returnValue
  })
  selectFlashCard(flashCards[0])
}

function selectFlashCard(flashCard) {
  selectedFlashCard = flashCard
  contentDiv.innerHTML = flashCard.content
}

function getPriority(flashCard, reviewTimes) {
  if (flashCard.lastReview == 0) {
    return 1
  }
  return (reviewTimes - flashCard.lastReview) / flashCard.reviewSpan
}

// Event Handlers

function onChangeFlashCardsSizeButtonClick(event) {
  let size = parseInt(prompt('請輸入數量(1~100000)', flashCards.length.toString()))
  if (Number.isNaN(size) || size < 1 || size > 100000) {
    alert('輸入範圍錯誤')
    return
  }
  flashCards.sort((a, b) => a.id - b.id)
  if (size > flashCards.length) {
    for (let i = flashCards.length + 1; i <= size; i++) {
      flashCards.push(new FlashCard(i.toString(), i))
    }
  } else {
    if(selectedFlashCard.id > size) {
      selectFlashCard(flashCards[0])
    }
    flashCards.length = size
  }
}

function onImportButtonClick(event) {
  flashCards = JSON.parse(importExportTextarea.value)
  selectFlashCard(flashCards[0])
  alert('匯入完成')
}

function onExportButtonClick(event) {
  flashCards.sort((a, b) => a.id - b.id)
  importExportTextarea.value = JSON.stringify(flashCards)
  alert('匯出完成')
}

function onContentDivInput(event) {
  selectedFlashCard.content = contentDiv.innerHTML
}

function onCustomSpanNextButtonClick(event) {
  let value = window.prompt('請輸入間隔(0~)', selectedFlashCard.reviewSpan)
  if (value >= 1 && value < Infinity) {
    selectedFlashCard.reviewSpan = parseFloat(value).toPrecision(7)
    selectNextFlashCard()
  } else {
    alert('輸入範圍錯誤')
  }
}

function onDecreaseSpanNextButtonClick(event) {
  selectedFlashCard.reviewSpan = Math.max(1, selectedFlashCard.reviewSpan / 2).toPrecision(7)
  selectNextFlashCard()
}

function onRemainSpanNextButtonClick(event) {
  selectNextFlashCard()
}

function onIncreaseSpanNextButtonClick(event) {
  selectedFlashCard.reviewSpan *= Math.max(3.4 - selectedFlashCard.reviewSpan ** 0.08, 1.2)
  selectedFlashCard.reviewSpan = selectedFlashCard.reviewSpan.toPrecision(7)
  selectNextFlashCard()
}

// Factories

class FlashCard {
  constructor(content, id, reviewSpan = 1, lastReview = 0) {
    this.content = content
    this.reviewSpan = reviewSpan
    this.lastReview = lastReview
    this.id = id
  }
}

//

document.addEventListener('DOMContentLoaded', initialize)
