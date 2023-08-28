
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js'
import recipeViews from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
//console.log(icons);

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if(module.hot){
  module.hot.accept();
}

const controlRecipies = async function(){
  try{
    const id = window.location.hash.slice(1);
    //console.log(id);
    if(!id) return;
    recipeViews.renderSpinner();

    //0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);
    //Loading Recipe

    await model.loadRecipe(id);

  // Rendering a recipe.

    recipeViews.render(model.state.recipe);
   //TEST
   controlServings();
   
  }catch (err){
     recipeViews.renderError();
    
  }
  
};

const controlSearchResults = async function(){
  try {

    resultsView.renderSpinner();

    //1. Get search Query 
    const query = searchView.getQuery();
    if(!query) return;

    //2. Load search results
    await model.loadSearchResults(query);

    //3. Rendering results

      // console.log(model.state.search.results)
      //resultsView.render(model.state.search.results)
      //for all results in one page we used the above one.

   resultsView.render(model.getSearchResultsPage());

   //4. Render initial pagination buttons
    paginationView.render(model.state.search);
 

  } catch (err) {
    console.log(err);
    recipeViews.renderError();
  }
 
};

const controlPagination = function(gotoPage){
  //1 Render New Results 
  resultsView.render(model.getSearchResultsPage(gotoPage));

   //4. Render New pagination buttons
    paginationView.render(model.state.search);

}

const controlServings = function(newServings=4){
  //Update the recipe servings(in state)
  model.updateServings(newServings);

  //Update the recipe view
  //recipeViews.render(model.state.recipe);
  recipeViews.update(model.state.recipe); 
}

const controlAddBookmark = function(){
  //Add the bookmarks 
  if(!model.state.recipe.bookmarked) 
    model.addBookMark(model.state.recipe);
  // Delete the bookmarks
 else
    model.deleteBookmark(model.state.recipe.id);
 
    //Update the recipe view
  //console.log(model.state.recipe);
  recipeViews.update(model.state.recipe);

  //Render the bookmarks
  bookmarkView.render(model.state.bookmarks)
};

const controlBookmarks = function(){
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
  try{
    //show loadibg spinner
    addRecipeView.renderSpinner();

  //Upload the new Recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

  //Render the added recipies
  recipeViews.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmarks
    bookmarkView.render(model.state.bookmarks);

    //Change id in url
    window.history.pushState(null,'', `#${model.state.recipe.id}`);

  //close form window
  setTimeout(function(){
    addRecipeView.toggleWindow()
  }, MODAL_CLOSE_SEC*1000);


}catch(err){
  console.error(err);
  addRecipeView.renderError(err.message);
}
}
const init = function(){
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeViews.addHandlerRender(controlRecipies);
  recipeViews.addHandlerUpdateServings(controlServings);
  recipeViews.AddHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
};
init();