import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import  brainJs from '@salesforce/resourceUrl/brainJs';
import trainedModel from './trainedModel.js'
let neuralNetwork
export default class ColorContrastExample extends LightningElement {
    dynamicCss;
    async connectedCallback(){
            await loadScript(this, brainJs)
            neuralNetwork = new brain.NeuralNetwork();
            neuralNetwork.fromJSON(trainedModel);
    }
    handleUpdateColors(){
        const currentColor = this.template.querySelector('lightning-input').value
        const rgb = this.hexToRgb(currentColor)
        const neuralNetworkInput = {r:rgb[0],g:rgb[1],b:rgb[2]}

        let predictionOutput = neuralNetwork.run(neuralNetworkInput)
        this.dynamicCss = this.buildCssString(rgb,predictionOutput)
    }

    buildCssString(rgb,predictionOutput){
        return `background-color:rgb(${rgb[0]},${rgb[1]},${rgb[2]}); color:${this.formatPredictionOutput(predictionOutput)}`
    }
    formatPredictionOutput(output){
        if(output.black > output.white){
            return "black"
        }
        return "white"
    }

    hexToRgb(hex){
        return  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        ,(m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))
    }
    
}