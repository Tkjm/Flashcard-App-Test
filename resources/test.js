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
  flashCards.push(FlashCardFactory.newInstance('1', 1))
  selectFlashCard(flashCards[0])
}

function selectNextFlashCard() {
  selectedFlashCard.lastReview = currentReviewTimes
  currentReviewTimes++
  flashCards.sort((a, b) => {
    let returnValue = b.priority(currentReviewTimes) - a.priority(currentReviewTimes)
    if (Math.abs(returnValue) <= 0.00001) {
      if (a.id < b.id) {
        returnValue = -0.00001
      } else {
        returnValue = 0.00001
      }
    }
    return returnValue
  })
  if (flashCards[0].priority(currentReviewTimes) < 1) {
    flashCards.unshift(FlashCardFactory.newInstance((flashCards.length + 1).toString(), flashCards.length + 1))
  }
  selectFlashCard(flashCards[0])
}

function selectFlashCard(flashCard) {
  selectedFlashCard = flashCard
  contentDiv.innerHTML = flashCard.content
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
      flashCards.push(FlashCardFactory.newInstance(i.toString(), i))
    }
  } else {
    flashCards.length = size
    if (selectedFlashCard.id > size) {
      selectNextFlashCard()
    }
  }
}

function onImportButtonClick(event) {
  importObject = JSON.parse(importExportTextarea.value)
  flashCards = [];
  for (let i = 0, length = importObject.flashCards.length; i < length; i++) {
    flashCards.push(FlashCardFactory.newInstance(...importObject.flashCardsProperties[i]))
  }
  selectFlashCard(flashCards.find(flashCard => flashCard.id === importObject.selectedFlashCardId))
  alert('匯入完成')
}

function onExportButtonClick(event) {
  let exportObject = {
    flashCardsProperties: [],
    selectedFlashCardId: selectedFlashCard.id
  }
  flashCards.sort((a, b) => a.id - b.id)
  for (let i = 0, length = flashCards.length; i < length; i++) {
    exportObject.flashCardsProperties.push([flashCards[i].content, flashCards[i].id, flashCards[i].reviewSpan, flashCards[i].lastReview])
  }
  importExportTextarea.value = JSON.stringify(exportObject)
  alert('匯出完成')
}

function onContentDivInput(event) {
  selectedFlashCard.content = contentDiv.innerHTML
}

function onCustomSpanNextButtonClick(event) {
  let value = window.prompt('請輸入間隔(0~)', selectedFlashCard.reviewSpan)
  if (value >= 1 && value < Infinity) {
    selectedFlashCard.reviewSpan = parseFloat(value).toPrecision(6)
    selectNextFlashCard()
  } else {
    alert('輸入範圍錯誤')
  }
}

function onDecreaseSpanNextButtonClick(event) {
  selectedFlashCard.reviewSpan = Math.max(1, selectedFlashCard.reviewSpan / 2).toFixed(1)
  selectNextFlashCard()
}

function onRemainSpanNextButtonClick(event) {
  selectNextFlashCard()
}

function onIncreaseSpanNextButtonClick(event) {
  selectedFlashCard.reviewSpan *= Math.max(3.95 - selectedFlashCard.reviewSpan ** 0.08, 1.2)
  selectedFlashCard.reviewSpan = selectedFlashCard.reviewSpan.toFixed(1)
  selectNextFlashCard()
}

// Factories

class FlashCardFactory {
  static newInstance(content, id, reviewSpan = 1, lastReview = 0) {
    let flashCard = new FlashCard()
    flashCard.content = content
    flashCard.id = id
    flashCard.reviewSpan = reviewSpan
    flashCard.lastReview = lastReview
    return flashCard
  }
}

// Classes

class FlashCard {
  constructor() {
    this.content = ''
    this.id = 0
    this.reviewSpan = 0
    this.lastReview = 0
  }

  priority(reviewTimes) {
    if (this.lastReview === 0) {
      return 1
    }
    return (reviewTimes - this.lastReview) / this.reviewSpan
  }
}

//

document.addEventListener('DOMContentLoaded', initialize)
