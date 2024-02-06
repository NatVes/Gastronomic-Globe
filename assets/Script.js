const bingMapsAPIKey = 'AmN9gnZWL8MOdvtKxP6U7jUfq9s0bgJrzjoS9a4kSn57vFOxx63oMw4HOnXdGbHR';
const themealdbAPIKey = 'https://themealdb.com/api/json/v1/1/list.php?c=list'; // 

/// Fetch recipes by name 
async function fetchRecipesByName(name) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}&apiKey=${themealdbAPIKey}`);
  const data = await response.json();
  return data.meals || [];
}

/// Display of recipe section
async function displayRecipesInRecipeSection(name) {
  const recipes = await fetchRecipesByName(name);
  if (recipes.length > 0) {
    recipes.forEach(recipe => {
      renderRecipeInRecipeSection(recipe);
    });
  } else {
    console.error('No recipes found.');
  }
}

/// Render recipe in the recipe section
function renderRecipeInRecipeSection(recipe) {
 
  console.log(`Render recipe in recipe section: ${recipe.strMeal}`);
}

/// Fetch the map data 
async function fetchAndRenderMap(countryName) {
  const mapURL = `https://dev.virtualearth.net/REST/v1/Imagery/Map/AerialWithLabels/${countryName}?mapSize=2000,1500&key=${bingMapsAPIKey}`;
  const mapResponse = await fetch(mapURL);
  const mapBlob = await mapResponse.blob();
  const mapImageUrl = URL.createObjectURL(mapBlob);
  document.getElementById('map').innerHTML = `<img src="${mapImageUrl}" alt="${countryName} Map">`;
}

/// options for the drop-down menus
async function renderDropdownOptions() {
  const foodURL = 'https://themealdb.com/api/json/v1/1/list.php?c=list';
  const foodResponse = await fetch(foodURL);
  const foodData = await foodResponse.json();
  foodData.meals.forEach(category => {
    const option = document.createElement('option');
    option.value = category.strCategory.toLowerCase();
    option.textContent = category.strCategory;
    document.getElementById('selectFood').appendChild(option);
  });

  /// options to fetch recipe through country 
  const allAreaURL = 'https://themealdb.com/api/json/v1/1/list.php?a=list';
  const areaResponse = await fetch(allAreaURL);
  const areaData = await areaResponse.json();
  const filteredCountries = areaData.meals
    .map(country => country.strArea)
    .filter(area => area !== 'Unknown');
  filteredCountries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.toLowerCase();
    option.textContent = country;
    document.getElementById('selectCountry').appendChild(option);
  });
}
///  searchBtn event listener
document.getElementById('searchBtn').addEventListener('click', async () => {
  event.preventDefault();
  const selectedFood = document.getElementById('selectFood').value;
  const selectedCountry = document.getElementById('selectCountry').value;

  // Fetch the map and render it
  await fetchAndRenderMap(selectedCountry);

  /// Wikipedia link to update
  document.getElementById('wikiBtn').href = `https://en.wikipedia.org/wiki/${selectedCountry}`;

  /// Fetch recipes by selected food and country
  const categoryURL = `https://themealdb.com/api/json/v1/1/filter.php?c=${selectedFood}`;
  const areaURL = `https://themealdb.com/api/json/v1/1/filter.php?a=${selectedCountry}`;

  const [categoryResponse, areaResponse] = await Promise.all([fetch(categoryURL), fetch(areaURL)]);
  const [categoryData, areaData] = await Promise.all([categoryResponse.json(), areaResponse.json()]);

  const categoryIds = categoryData.meals.map(meal => meal.idMeal);
  const areaIds = areaData.meals.map(meal => meal.idMeal);

  const matchingIds = categoryIds.filter(id => areaIds.includes(id));

  if (matchingIds.length === 0) {
    document.getElementById('recipe').innerHTML = '<p>No matches found :(</p>';
  } else {
    const randomId = matchingIds[Math.floor(Math.random() * matchingIds.length)];
    const mealByIdResponse = await fetch(`https://themealdb.com/api/json/v1/1/lookup.php?i=${randomId}`);
    const mealByIdData = await mealByIdResponse.json();
    const randomMeal = mealByIdData.meals[0];

    /// Render the selected recipe in the #recipe element
    document.getElementById('recipe').innerHTML = `
      <img src="${randomMeal.strMealThumb}" class="card-img-top" alt="${randomMeal.strMeal}">
      <div class="card-body">
        <h5 class="card-title">${randomMeal.strMeal}</h5>
        <p class="card-text">${randomMeal.strInstructions}</p>
        <a href="#" class="btn save-btn">Save</a>
      </div>
    `;
  }
});

/// Event listener for .save-btn
document.querySelector('.save-btn').addEventListener('click', () => {

});

/// Function to render 3 random cards on the bottom of the page
async function renderRandomCards() {
  const randomRecipeURL = 'https://themealdb.com/api/json/v1/1/random.php';
  for (let i = 0; i < 3; i++) {
    const randomResponse = await fetch(randomRecipeURL);
    const randomData = await randomResponse.json();
    const randomRecipe = randomData.meals[0];

    /// Append received data to the #collection element in the footer
    document.getElementById('collection').innerHTML += `
      <div class="card">
        <img src="${randomRecipe.strMealThumb}" class="card-img-top" alt="${randomRecipe.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${randomRecipe.strMeal}</h5>
          <a href="#" class="btn save-btn">Open</a>
        </div>
      </div>
    `;
  }
}

/// Render the options within drop-down menus
renderDropdownOptions();

