let changeFlashCardsSizeButton
let importButton
let exportButton
let importExportTextarea
let statusDiv
let contentDiv
let customSpanNextButton
let decreaseSpanNextButton
let remainSpanNextButton
let increaseSpanNextButton

let currentStudyTime = 1
let selectedFlashCard
let flashCards = []

// Functions

function initialize() {
  changeFlashCardsSizeButton = document.querySelector('.changeFlashCardsSizeButton')
  importButton = document.querySelector('.importButton')
  exportButton = document.querySelector('.exportButton')
  importExportTextarea = document.querySelector('.importExportTextarea')
  statusDiv = document.querySelector('.statusDiv')
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
  flashCards.push(FlashCardFactory.createFlashCard('1', 1))
  selectFlashCard(flashCards[0])
}

function selectNextFlashCard() {
  selectedFlashCard.lastRetreiveStudyTime = currentStudyTime
  selectedFlashCard.retreivedTimes++
  currentStudyTime++
  flashCards.sort((a, b) => {
    let returnValue = b.priority(currentStudyTime) - a.priority(currentStudyTime)
    if (Math.abs(returnValue) <= 0.00001) {
      if (a.id < b.id) {
        returnValue = -0.00001
      } else {
        returnValue = 0.00001
      }
    }
    return returnValue
  })
  if (flashCards[0].priority(currentStudyTime) < 1) {
    flashCards.unshift(FlashCardFactory.createFlashCard((flashCards.length + 1).toString(), flashCards.length + 1))
  }
  selectFlashCard(flashCards[0])
}

function selectFlashCard(flashCard) {
  selectedFlashCard = flashCard
  statusDiv.innerHTML = `已複習次數: ${currentStudyTime - 1} (本卡片: ${flashCard.retreivedTimes})`
  contentDiv.innerHTML = flashCard.content
  decreaseSpanNextButton.innerHTML = `減少(${selectedFlashCard.retreiveSpan}->${selectedFlashCard.decreasedRetreiveSpan()})`
  increaseSpanNextButton.innerHTML = `增加(${selectedFlashCard.retreiveSpan}->${selectedFlashCard.increasedRetreiveSpan()})`
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
      flashCards.push(FlashCardFactory.createFlashCard(i.toString(), i))
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
  for (let i = 0, length = importObject.flashCardsProperties.length; i < length; i++) {
    flashCards.push(FlashCardFactory.createFlashCard(...importObject.flashCardsProperties[i]))
  }
  currentStudyTime = importObject.currentStudyTime
  selectFlashCard(flashCards.find(flashCard => flashCard.id === importObject.selectedFlashCardId))
  alert('匯入完成')
}

function onExportButtonClick(event) {
  let exportObject = {
    flashCardsProperties: [],
    currentStudyTime: currentStudyTime,
    selectedFlashCardId: selectedFlashCard.id
  }
  flashCards.sort((a, b) => a.id - b.id)
  for (let i = 0, length = flashCards.length; i < length; i++) {
    exportObject.flashCardsProperties.push([flashCards[i].content, flashCards[i].id, flashCards[i].retreiveSpan, flashCards[i].lastRetreiveStudyTime, flashCards[i].retreivedTimes])
  }
  importExportTextarea.value = JSON.stringify(exportObject)
  alert('匯出完成')
}

function onContentDivInput(event) {
  selectedFlashCard.content = contentDiv.innerHTML
}

function onCustomSpanNextButtonClick(event) {
  let value = window.prompt('請輸入間隔(0~)', selectedFlashCard.retreiveSpan)
  if (value >= 1 && value < Infinity) {
    selectedFlashCard.retreiveSpan = Number.parseFloat(Number.parseFloat(value).toFixed(1))
    selectNextFlashCard()
  } else {
    alert('輸入範圍錯誤')
  }
}

function onDecreaseSpanNextButtonClick(event) {
  selectedFlashCard.retreiveSpan = selectedFlashCard.decreasedRetreiveSpan()
  selectNextFlashCard()
}

function onRemainSpanNextButtonClick(event) {
  selectNextFlashCard()
}

function onIncreaseSpanNextButtonClick(event) {
  selectedFlashCard.retreiveSpan = selectedFlashCard.increasedRetreiveSpan()
  selectNextFlashCard()
}

// Factories

class FlashCardFactory {
  static createFlashCard(content, id, retreiveSpan = 1, lastRetreiveStudyTime = 0, retreivedTimes = 0) {
    let flashCard = new FlashCard()
    flashCard.content = content
    flashCard.id = id
    flashCard.retreiveSpan = Number.parseFloat(retreiveSpan.toFixed(1))
    flashCard.lastRetreiveStudyTime = lastRetreiveStudyTime
    flashCard.retreivedTimes = retreivedTimes
    return flashCard
  }
}

// Classes

class FlashCard {
  constructor() {
    this.content = ''
    this.id = 0
    this.retreiveSpan = 0
    this.lastRetreiveStudyTime = 0
    this.retreivedTimes = 0
  }

  priority(studyTime) {
    if (this.lastRetreiveStudyTime === 0) {
      return 1
    }
    return (studyTime - this.lastRetreiveStudyTime) / this.retreiveSpan
  }

  decreasedRetreiveSpan() {
    return Number.parseFloat(Math.max(1, this.retreiveSpan / 2).toFixed(1))
  }

  increasedRetreiveSpan() {
    return Number.parseFloat((this.retreiveSpan * Math.max(3.95 - this.retreiveSpan ** 0.08, 1.2)).toFixed(1))
  }

}

//

document.addEventListener('DOMContentLoaded', initialize)
