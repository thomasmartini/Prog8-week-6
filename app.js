import { DecisionTree } from "./decisiontree.js"
import { VegaTree } from "./vegatree.js"
//
// DATA
//
const csvFile = "./diabetes.csv"
const trainingLabel = "Label"  
const ignored = []  
let correct = []
let diabetes = []
let falsePositive = []
let noDiabetes = []
let falseNegative = []

//
// laad csv data als json
//

function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => { 
            console.log(results.data)
            trainModel(results.data)
        } // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//

function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5))
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view',1800, 1000, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    let person = testData[0]
    let personPrediction = decisionTree.predict(person)
    console.log(`Has diabetes : ${personPrediction}`)
    for(let datas of testData){
    testDiabetes(datas, decisionTree)
    }
    // todo : bereken de accuracy met behulp van alle test data

    let accuracy = correct.length / testData.length * 100
    console.log(accuracy)
    document.getElementById('accuracy').innerText = "accuracy: - "+  accuracy +'%'
    document.getElementById('act true').innerText = diabetes.length
    document.getElementById('act false 2').innerText = noDiabetes.length
    document.getElementById('act true 2').innerText  = falseNegative.length
    document.getElementById('act false').innerText = falsePositive.length

    saveModel(decisionTree)

}
function testDiabetes(person, decisionTree) {
    // kopie van diabetes maken, zonder het Label label
    const personWithoutLabel = { ...person }
    delete personWithoutLabel.label

    // prediction
    let prediction = decisionTree.predict(personWithoutLabel)
    // vergelijk de prediction met het echte label
    let message = (prediction == person.Label) ? "goed voorspeld!" : "fout voorspeld!"
    console.log(message)
    if(prediction == person.Label){
        correct.push(message)
    }
    if(prediction == 1 && person.Label == 1){
        diabetes.push('actually diabetes')
    }
    if(prediction == 0 && person.Label == 0){
        noDiabetes.push('no diabetes')
    }
    if(prediction == 0 && person.Label == 1){
        falseNegative.push('false negative')
    }
    if(prediction == 1 && person.Label == 0){
        falsePositive.push('false positive')
    }
}

function saveModel(decisionTree){
    let json = decisionTree.stringify()
    console.log(json)
}
loadData()