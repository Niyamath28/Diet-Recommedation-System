// Recipe Database JavaScript
class RecipeDatabase {
    constructor() {
        this.apiKey = 'f2c6b26569a641c4a1fcd5c87b19a562'; // Spoonacular API key
        this.baseUrl = 'https://api.spoonacular.com/recipes';
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentFilters = {};
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.loadFeaturedRecipes();
    }

    bindEvents() {
        document.getElementById('recipeSearchForm').addEventListener('submit', (e) => this.handleSearch(e));
        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleTheme());
        
        // Category click events
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleCategoryClick(e));
        });
    }

    async handleSearch(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        this.currentFilters = {
            query: document.getElementById('searchQuery').value,
            diet: document.getElementById('dietFilter').value,
            cuisine: document.getElementById('cuisineFilter').value,
            maxCalories: document.getElementById('maxCalories').value,
            maxTime: document.getElementById('maxTime').value
        };

        this.currentPage = 1;
        await this.searchRecipes();
    }

    async searchRecipes() {
        this.showLoading();
        this.hideNoResults();
        
        try {
            const recipes = await this.fetchRecipes();
            this.displayRecipes(recipes);
            this.updatePagination();
        } catch (error) {
            console.error('Error fetching recipes:', error);
            this.showNoResults();
        } finally {
            this.hideLoading();
        }
    }

    async fetchRecipes() {
        const params = new URLSearchParams({
            apiKey: this.apiKey,
            number: 12,
            offset: (this.currentPage - 1) * 12
        });

        // Add filters
        if (this.currentFilters.query) {
            params.append('query', this.currentFilters.query);
        }
        if (this.currentFilters.diet) {
            params.append('diet', this.currentFilters.diet);
        }
        if (this.currentFilters.cuisine) {
            params.append('cuisine', this.currentFilters.cuisine);
        }
        if (this.currentFilters.maxCalories) {
            params.append('maxCalories', this.currentFilters.maxCalories);
        }
        if (this.currentFilters.maxTime) {
            params.append('maxReadyTime', this.currentFilters.maxTime);
        }

        const response = await fetch(`${this.baseUrl}/complexSearch?${params}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        this.totalPages = Math.ceil(data.totalResults / 12);
        
        return data.results;
    }

    displayRecipes(recipes) {
        const container = document.getElementById('recipeResults');
        
        if (recipes.length === 0) {
            this.showNoResults();
            return;
        }

        container.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
    }

    createRecipeCard(recipe) {
        return `
            <div class="col-lg-4 col-md-6">
                <div class="card recipe-card h-100 border-0 shadow-sm">
                    <div class="recipe-image position-relative">
                        <img src="${recipe.image}" alt="${recipe.title}" 
                             class="card-img-top" style="height: 200px; object-fit: cover;">
                        <div class="recipe-badges position-absolute top-0 end-0 p-2">
                            ${recipe.vegetarian ? '<span class="badge bg-success me-1">Vegetarian</span>' : ''}
                            ${recipe.vegan ? '<span class="badge bg-success me-1">Vegan</span>' : ''}
                            ${recipe.glutenFree ? '<span class="badge bg-info me-1">Gluten-Free</span>' : ''}
                            ${recipe.dairyFree ? '<span class="badge bg-info me-1">Dairy-Free</span>' : ''}
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${recipe.title}</h5>
                        <div class="recipe-meta mb-3">
                            <div class="row g-2">
                                <div class="col-6">
                                    <small class="text-muted">
                                        <i class="fas fa-clock me-1"></i>
                                        ${recipe.readyInMinutes || 'N/A'} min
                                    </small>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">
                                        <i class="fas fa-users me-1"></i>
                                        ${recipe.servings || 'N/A'} servings
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div class="mt-auto">
                            <button class="btn btn-primary w-100" onclick="recipeDatabase.showRecipeDetails(${recipe.id})">
                                <i class="fas fa-eye me-2"></i>
                                View Recipe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async showRecipeDetails(recipeId) {
        try {
            const recipe = await this.fetchRecipeDetails(recipeId);
            this.displayRecipeModal(recipe);
        } catch (error) {
            console.error('Error fetching recipe details:', error);
            this.showToast('Failed to load recipe details', 'error');
        }
    }

    async fetchRecipeDetails(recipeId) {
        const params = new URLSearchParams({
            apiKey: this.apiKey,
            includeNutrition: true
        });

        const response = await fetch(`${this.baseUrl}/${recipeId}/information?${params}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    }

    displayRecipeModal(recipe) {
        const modalBody = document.getElementById('recipeModalBody');
        const modalTitle = document.getElementById('recipeModalLabel');
        
        modalTitle.textContent = recipe.title;
        
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${recipe.image}" alt="${recipe.title}" class="img-fluid rounded mb-3">
                    <div class="recipe-info">
                        <h6>Recipe Information</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-clock me-2"></i>Prep Time: ${recipe.preparationMinutes || 'N/A'} min</li>
                            <li><i class="fas fa-fire me-2"></i>Cook Time: ${recipe.cookingMinutes || 'N/A'} min</li>
                            <li><i class="fas fa-users me-2"></i>Servings: ${recipe.servings || 'N/A'}</li>
                            <li><i class="fas fa-star me-2"></i>Rating: ${recipe.spoonacularScore || 'N/A'}/100</li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <h6>Ingredients</h6>
                    <ul class="list-group list-group-flush mb-3">
                        ${recipe.extendedIngredients.map(ingredient => `
                            <li class="list-group-item d-flex justify-content-between">
                                <span>${ingredient.original}</span>
                                <small class="text-muted">${ingredient.amount} ${ingredient.unit}</small>
                            </li>
                        `).join('')}
                    </ul>
                    
                    <h6>Nutrition (per serving)</h6>
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <div class="nutrition-item text-center p-2 border rounded">
                                <div class="fw-bold text-danger">${Math.round(recipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0)}</div>
                                <small class="text-muted">Calories</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="nutrition-item text-center p-2 border rounded">
                                <div class="fw-bold text-warning">${Math.round(recipe.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0)}g</div>
                                <small class="text-muted">Protein</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="nutrition-item text-center p-2 border rounded">
                                <div class="fw-bold text-info">${Math.round(recipe.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0)}g</div>
                                <small class="text-muted">Carbs</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="nutrition-item text-center p-2 border rounded">
                                <div class="fw-bold text-primary">${Math.round(recipe.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0)}g</div>
                                <small class="text-muted">Fat</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <h6>Instructions</h6>
                    <div class="instructions">
                        ${recipe.instructions ? recipe.instructions.replace(/\n/g, '<br>') : 'No instructions available'}
                    </div>
                </div>
            </div>
        `;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('recipeModal'));
        modal.show();
    }

    async loadFeaturedRecipes() {
        // Load some featured recipes on page load
        this.currentFilters = { query: 'healthy' };
        await this.searchRecipes();
    }

    handleCategoryClick(e) {
        const category = e.currentTarget.querySelector('.card-title').textContent.toLowerCase();
        
        // Set search query based on category
        document.getElementById('searchQuery').value = category;
        
        // Trigger search
        document.getElementById('recipeSearchForm').dispatchEvent(new Event('submit'));
    }

    updatePagination() {
        const pagination = document.getElementById('pagination');
        
        if (this.totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="recipeDatabase.goToPage(${this.currentPage - 1})">Previous</a>
                </li>
            `;
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="recipeDatabase.goToPage(${i})">${i}</a>
                </li>
            `;
        }

        // Next button
        if (this.currentPage < this.totalPages) {
            paginationHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="recipeDatabase.goToPage(${this.currentPage + 1})">Next</a>
                </li>
            `;
        }

        pagination.innerHTML = paginationHTML;
    }

    async goToPage(page) {
        this.currentPage = page;
        await this.searchRecipes();
        
        // Scroll to top of results
        document.getElementById('recipeResults').scrollIntoView({ behavior: 'smooth' });
    }

    clearFilters() {
        document.getElementById('recipeSearchForm').reset();
        this.currentFilters = {};
        this.currentPage = 1;
        this.loadFeaturedRecipes();
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('d-none');
        document.getElementById('recipeResults').innerHTML = '';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('d-none');
    }

    showNoResults() {
        document.getElementById('noResults').classList.remove('d-none');
        document.getElementById('recipeResults').innerHTML = '';
    }

    hideNoResults() {
        document.getElementById('noResults').classList.add('d-none');
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Remove after hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Initialize the app when DOM is loaded
let recipeDatabase;
document.addEventListener('DOMContentLoaded', () => {
    recipeDatabase = new RecipeDatabase();
});

// Demo data for when API key is not available
const demoRecipes = [
    {
        id: 1,
        title: 'Grilled Chicken Salad',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        readyInMinutes: 25,
        servings: 2,
        vegetarian: false,
        vegan: false,
        glutenFree: true,
        dairyFree: true
    },
    {
        id: 2,
        title: 'Quinoa Buddha Bowl',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
        readyInMinutes: 30,
        servings: 1,
        vegetarian: true,
        vegan: true,
        glutenFree: true,
        dairyFree: true
    },
    {
        id: 3,
        title: 'Salmon with Roasted Vegetables',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        readyInMinutes: 35,
        servings: 2,
        vegetarian: false,
        vegan: false,
        glutenFree: true,
        dairyFree: true
    }
];
