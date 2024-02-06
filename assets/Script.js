const bingMapsAPIKey = 'AmN9gnZWL8MOdvtKxP6U7jUfq9s0bgJrzjoS9a4kSn57vFOxx63oMw4HOnXdGbHR';

const countries = ["America", "United%20kingdom", "Canada", "China", "Croatia", "Netherlands", "Egypt", "Philippines", "France", "Greece", "India", "Ireland", "Italy", "Jamaica", "Japan", "Kenya", "Malaysia", "Mexico", "Morocco", "Poland", "Portugal", " Russia", "Spanish", "Thailand", "Tunisia", "Turkey", "Vietnam"];

let recipes = [];

checkAdd();

/// Fetch the map data 
async function fetchAndRenderMap(countryName) {
  const mapURL = `https://dev.virtualearth.net/REST/v1/Imagery/Map/AerialWithLabels/${countryName}?mapSize=2000,1500&key=${bingMapsAPIKey}`;
  const mapResponse = await fetch(mapURL);
  const mapBlob = await mapResponse.blob();
  const mapImageUrl = URL.createObjectURL(mapBlob);
  document.getElementById('map').innerHTML = `<img src="${mapImageUrl}" alt="${countryName} Map" style="object-fit: cover; width: 100%; height: 100%">`;
}

/// options for the drop-down menus
(async function renderDropdownOptions() {
  /// options to fetch recipe through food type
  const foodURL = 'https://themealdb.com/api/json/v1/1/list.php?c=list';
  const foodResponse = await fetch(foodURL);
  const foodData = await foodResponse.json();
  foodData.meals.forEach(category => {    
    $("#selectFood").append(`<option value="${category.strCategory}">${category.strCategory}</option>`); 
  });

  /// options to fetch recipe through country 
  const allAreaURL = 'https://themealdb.com/api/json/v1/1/list.php?a=list';
  const areaResponse = await fetch(allAreaURL);
  const areaData = await areaResponse.json();
  const filteredCountries = areaData.meals
    .map(country => country.strArea)
    .filter(area => area !== 'Unknown');    
  for(i=0; i<filteredCountries.length; i++) {
    $("#selectCountry").append(`<option value="${countries[i]}">${filteredCountries[i]}</option>`);
  };
})();

///  searchBtn event listener
$("#searchBtn").on('click', async (event) => {
  event.preventDefault();
  let selectedFood = $("#selectFood").val();
  let selectedCountry = $("#selectCountry").val(); //america
  let areaName = $("#selectCountry option:selected").text(); //american
  // Fetch the map and render it
  await fetchAndRenderMap(selectedCountry);

  /// Wikipedia link to update
  $("#wikiBtn a").attr({"href": `https://en.wikipedia.org/wiki/${selectedCountry}`, "target": "_blank"}); 

  /// Fetch recipes by selected food and country
  let categoryURL = `https://themealdb.com/api/json/v1/1/filter.php?c=${selectedFood}`;
  let areaURL = `https://themealdb.com/api/json/v1/1/filter.php?a=${areaName}`;

  let [categoryResponse, areaResponse] = await Promise.all([fetch(categoryURL), fetch(areaURL)]);
  let [categoryData, areaData] = await Promise.all([categoryResponse.json(), areaResponse.json()]);

  let categoryIds = categoryData.meals.map(meal => meal.idMeal);
  let areaIds = areaData.meals.map(meal => meal.idMeal);

  let matchingIds = categoryIds.filter(id => areaIds.includes(id));

  if (matchingIds.length === 0) {
    $("#recipe").text("");
    $("#recipe").append(`<div class="row justify-content-center">No matches found :(</div>`);
  } else {
    let randomId = matchingIds[Math.floor(Math.random() * matchingIds.length)];

    let mealIdURL = `https://themealdb.com/api/json/v1/1/lookup.php?i=${randomId}`;
    let mealByIdResponse = await fetch(mealIdURL);
    let mealByIdData = await mealByIdResponse.json();
    let randomMeal = mealByIdData.meals[0];

    /// Render the selected recipe in the #recipe element
    $("#recipe").text("");
    let ol = listIngredients(mealByIdData);                    
    $("#recipe").append(`<div class="row justify-content-center">
                            <div class="card col-sm-11 col-md-10 col-lg-7 col-xl-7">                        
                                <img src="${randomMeal.strMealThumb}" class="card-img-top" alt="${randomMeal.strMeal}" style="object-fit: cover; width: 100%; height: 30vh">
                                <div class="card-body">
                                    <h5 class="card-title" data-id:"${randomMeal.idMeal}">${randomMeal.strMeal}</h5>
                                    ${ol.prop('outerHTML')}
                                    <p class="card-text">${randomMeal.strInstructions}</p>
                                    <div class="row justify-content-end">
                                        <button class="btn col-xxl-2 col-sm-2 save-btn">Save</button>                                                       
                                    </div>                        
                                </div>                        
                            </div>
                        </div>`)
  }
});

/// Event listener for .save-btn
$("#recipe").on("click", ".save-btn", function(event) {
  event.preventDefault();
  let mealName = $("h5", "#recipe").text(); 
  if (!recipes.includes(mealName)) {
      recipes.push(mealName);
  }
  storeSavedData();
});

/// Function to render 3 random cards on the bottom of the page
(async function renderRandomCards() {
  const randomRecipeURL = 'https://themealdb.com/api/json/v1/1/random.php';
  for (let i = 0; i < 3; i++) {
      const randomResponse = await fetch(randomRecipeURL);
      const randomData = await randomResponse.json();
      const randomRecipe = randomData.meals[0];
      let ol = listIngredients(randomData);
      let modalId = `staticBackdrop-${i}`;
      // Append received data to the #collection element in the footer
      $("#collectionCard").append(`<div class="card col-sm-8 col-md-3 col-xl-2 align-content-between">                            
      <img src="${randomRecipe.strMealThumb}" class="card-img-top" alt="${randomRecipe.strMeal}" style="object-fit: cover; width: 100%">
      <div class="card-body flex-column align-content-end">
          <h5 class="card-title fs-6">${randomRecipe.strMeal}</h5>
          <button type="button" class="btn open-btn" data-bs-toggle="modal" data-bs-target="#${modalId}">Open</button>
          <div class="modal fade" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">                                                    
                          <h1 class="modal-title fs-5" id="${modalId}Label">${randomRecipe.strMeal}</h1>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body text-start">
                              ${ol.prop('outerHTML')}
                              <p class="card-text">${randomRecipe.strInstructions}</p>                                                                           
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>                                                      
                      </div>
                  </div>
              </div>
          </div>
      </div>                            
  </div>`);
  }
})();

function storeSavedData() {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function checkAdd() {    
  let storedData = JSON.parse(localStorage.getItem("recipes"));    
  if (storedData !== null) {
      recipes = storedData;
  }    
}

function listIngredients(data) {
  let strIngredient = Object.keys(data.meals[0]).filter(key => key.includes("strIngredient"));   //create an array of all the keys containing "strIngredient"               
  let ingredients = strIngredient.map(key => data.meals[0][key]).filter(value => value !== null); //delete all "strIngredient" with value = null

  let strMeasure = Object.keys(data.meals[0]).filter(key => key.includes("strMeasure")); //create an array of all the keys containing "strMeasure"               
  let measure = strMeasure.map(key => data.meals[0][key]).filter(value => value !== null); //delete all "strIngredient" with value = null

  let allMeasureIngredient = ingredients.map((ing, msr) => {   //create an array of arrays containing matching ingredients and measures
      return [ing, measure[msr]]
  });

  let measureIngredient = allMeasureIngredient.map(pair => pair.filter(value => value !== "" && value !== " ")).filter(array => array.length>0); //delete all empty arrays    
  
  let ol = $("<ol>");
  
  for(let i=0; i<measureIngredient.length; i++) {
      let li = $("<li>");
      if(measureIngredient[i].length<2) {
          li.text(measureIngredient[i][0]);
      } else {
          li.text(measureIngredient[i][0] + " - " + measureIngredient[i][1]);
      }
      ol.append(li);
  }
  return ol;
}

