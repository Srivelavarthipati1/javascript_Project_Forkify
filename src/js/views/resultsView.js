import View from "./view";
import previewView from "./previewView";

class resultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = `No Recipe Found For Your Query!. Please Try Again!!!`;
    _message = '';

    _generateMarkup(){
        //console.log(this._data);
        return this._data.map(this._generateMarkupPreview).join('');
       
    }
    _generateMarkup(){
      //console.log(this._data);
      return this._data
      .map(result => previewView.render(result,false))
      .join('');
     
  }
}
export default new resultsView();