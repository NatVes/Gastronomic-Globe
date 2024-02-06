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