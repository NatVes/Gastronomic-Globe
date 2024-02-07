let recipesToRender = JSON.parse(localStorage.getItem("recipes"));

for(j=0; j<recipesToRender.length; j++) {
    
    let menuNameURL = `https://themealdb.com/api/json/v1/1/search.php?s=${recipesToRender[j]}`;

    fetch(menuNameURL)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            let ol = listIngredients(data);
            let modalId = `staticBackdrop-${j}`;

            $("#stockCard").append(`<div class="card col-sm-8 col-md-3 col-xl-2">                        
            <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="${data.meals[0].strMeal}" style="object-fit: cover; width: 100%">
            <div class="card-body flex-column align-content-end">
                <h5 class="card-title">${data.meals[0].strMeal}</h5>                        
                <button type="button" class="btn open-btn" data-bs-toggle="modal" data-bs-target="#${modalId}">Open</button>
                <div class="modal fade" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">                                                    
                                <h1 class="modal-title fs-5" id="${modalId}Label">${data.meals[0].strMeal}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-start">
                                    ${ol.prop('outerHTML')}
                                    <p class="card-text">${data.meals[0].strInstructions}</p>                                                                           
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>                                                      
                            </div>
                        </div>
                    </div>
                </div>
            </div>                        
        </div>`)
        });
}




