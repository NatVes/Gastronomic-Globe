//script.js
document.addEventListener("DOMContentLoaded", function () {
    const MEAL_DB_API_KEY = .............................
    const BING_MAPS_API_KEY = "AmN9gnZWL8MOdvtKxP6U7jUfq9s0bgJrzjoS9a4kSn57vFOxx63oMw4HOnXdGbHR"; 
    const MEAL_DB_API_URL = "https://www.themealdb.com/api/json/v1/";
    const BING_MAPS_API_URL = "https://dev.virtualearth.net/REST/v1/Imagery/Map/AerialWithLabels/united%20?mapSize=500,400&key=" + BING_MAPS_API_KEY;

 
  
    
    //Bing Maps API
    function displayMap(location) {
      fetch(`${BING_MAPS_API_URL}`)
        .then((response) => response.json())
        .then((data) => {
          const coordinates = data.resourceSets[0].resources[0].point.coordinates;
         
          console.log("Map Coordinates:", coordinates);
        })
        .catch((error) => {
          console.error("Error fetching map data:", error);
        });
    }
  
    // Event listener...Wikipedia button
    document.getElementById("wikiBtn").addEventListener("click", function () {
      const wikipediaLink = "https://en.wikipedia.org/";
      window.open(wikipediaLink, "_blank");
    });
  
    // comme