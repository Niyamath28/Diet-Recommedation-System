// Meal Planning JavaScript
class MealPlanner {
    constructor() {
        this.apiKey = 'f2c6b26569a641c4a1fcd5c87b19a562'; // Spoonacular API key
        this.baseUrl = 'https://api.spoonacular.com/mealplanner/generate';
        this.nutritionChart = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.initializeChart();
        this.loadSavedPreferences();
    }

    bindEvents() {
        document.getElementById('mealPlanForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleTheme());
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const mealPlanData = {
            targetCalories: parseInt(document.getElementById('targetCalories').value),
            diet: document.getElementById('dietType').value,
            exclude: document.getElementById('excludeIngredients').value,
            timeFrame: document.getElementById('timeFrame').value
        };

        if (!this.validateForm(mealPlanData)) {
            return;
        }

        this.showLoading();
        this.hideError();
        
        try {
            const mealPlan = await this.generateMealPlan(mealPlanData);
            this.displayMealPlan(mealPlan);
            this.savePreferences(mealPlanData);
        } catch (error) {
            console.error('Meal plan generation failed:', error);
            // Use demo data as fallback
            this.showError('API temporarily unavailable. Showing demo meal plan.');
            this.displayMealPlan(this.generateDemoMealPlan(mealPlanData));
            this.savePreferences(mealPlanData);
        } finally {
            this.hideLoading();
        }
    }

    async generateMealPlan(data) {
        const params = new URLSearchParams({
            timeFrame: data.timeFrame,
            targetCalories: data.targetCalories,
            diet: data.diet,
            exclude: data.exclude,
            apiKey: this.apiKey
        });

        console.log('API Request URL:', `${this.baseUrl}?${params}`);
        
        try {
            const response = await fetch(`${this.baseUrl}?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('API Response:', result);
            return result;
        } catch (error) {
            console.error('Fetch Error:', error);
            throw error;
        }
    }

    displayMealPlan(mealPlan) {
        // Display meals
        this.displayMeals(mealPlan.meals);
        
        // Update nutrition summary
        this.updateNutritionSummary(mealPlan.nutrients);
        
        // Display shopping list
        this.displayShoppingList(mealPlan.shoppingList);
        
        // Show results
        document.getElementById('mealPlanResults').classList.remove('d-none');
    }

    displayMeals(meals) {
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        
        mealTypes.forEach(mealType => {
            const meal = meals.find(m => m.type === mealType);
            const container = document.getElementById(`${mealType}Meal`);
            
            if (meal) {
                container.innerHTML = this.createMealCard(meal);
            } else {
                container.innerHTML = '<p class="text-muted">No meal found</p>';
            }
        });
    }

    createMealCard(meal) {
        return `
            <div class="meal-item">
                <h6 class="fw-bold mb-2">${meal.title}</h6>
                <div class="meal-image mb-3">
                    <img src="${meal.image}" alt="${meal.title}" class="img-fluid rounded" style="width: 100%; height: 150px; object-fit: cover;">
                </div>
                <div class="meal-nutrition mb-3">
                    <div class="row g-2">
                        <div class="col-6">
                            <small class="text-muted">Calories</small>
                            <div class="fw-bold text-danger">${meal.nutrition.calories}</div>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Protein</small>
                            <div class="fw-bold text-warning">${meal.nutrition.protein}g</div>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Carbs</small>
                            <div class="fw-bold text-info">${meal.nutrition.carbs}g</div>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Fat</small>
                            <div class="fw-bold text-primary">${meal.nutrition.fat}g</div>
                        </div>
                    </div>
                </div>
                <div class="meal-actions">
                    <a href="${meal.sourceUrl}" target="_blank" class="btn btn-outline-primary btn-sm w-100">
                        <i class="fas fa-external-link-alt me-1"></i>
                        View Recipe
                    </a>
                </div>
            </div>
        `;
    }

    updateNutritionSummary(nutrients) {
        document.getElementById('totalCalories').textContent = nutrients.calories;
        document.getElementById('totalProtein').textContent = `${nutrients.protein}g`;
        document.getElementById('totalCarbs').textContent = `${nutrients.carbohydrates}g`;
        document.getElementById('totalFat').textContent = `${nutrients.fat}g`;

        // Update chart
        this.updateNutritionChart(nutrients);
    }

    updateNutritionChart(nutrients) {
        if (this.nutritionChart) {
            this.nutritionChart.data.datasets[0].data = [
                nutrients.protein,
                nutrients.carbohydrates,
                nutrients.fat
            ];
            this.nutritionChart.update();
        }
    }

    displayShoppingList(shoppingList) {
        const container = document.getElementById('shoppingList');
        
        if (shoppingList && shoppingList.length > 0) {
            container.innerHTML = shoppingList.map(item => `
                <div class="col-md-6 col-lg-4">
                    <div class="shopping-item d-flex align-items-center p-3 border rounded">
                        <i class="fas fa-shopping-basket text-primary me-3"></i>
                        <div class="flex-grow-1">
                            <div class="fw-semibold">${item.name}</div>
                            <small class="text-muted">${item.amount} ${item.unit}</small>
                        </div>
                        <button class="btn btn-outline-success btn-sm" onclick="this.classList.toggle('btn-success')">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="col-12"><p class="text-muted">No shopping list available</p></div>';
        }
    }

    initializeChart() {
        const ctx = document.getElementById('nutritionChart');
        if (ctx) {
            this.nutritionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Protein', 'Carbs', 'Fat'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: [
                            '#ffc107',
                            '#0dcaf0',
                            '#0d6efd'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    validateForm(data) {
        if (!data.targetCalories || data.targetCalories < 800 || data.targetCalories > 5000) {
            this.showError('Please enter a valid calorie target between 800-5000 kcal.');
            return false;
        }
        
        if (!data.diet) {
            this.showError('Please select a diet type.');
            return false;
        }
        
        return true;
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('d-none');
        document.getElementById('mealPlanResults').classList.add('d-none');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('d-none');
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorElement.classList.remove('d-none');
    }

    hideError() {
        document.getElementById('errorMessage').classList.add('d-none');
    }

    savePreferences(data) {
        localStorage.setItem('mealPlanner_preferences', JSON.stringify(data));
    }

    loadSavedPreferences() {
        const saved = localStorage.getItem('mealPlanner_preferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            document.getElementById('targetCalories').value = preferences.targetCalories || '';
            document.getElementById('dietType').value = preferences.diet || '';
            document.getElementById('excludeIngredients').value = preferences.exclude || '';
            document.getElementById('timeFrame').value = preferences.timeFrame || 'day';
        }
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

    generateDemoMealPlan(data) {
        const targetCalories = data.targetCalories || 2000;
        const diet = data.diet || '';
        
        // Generate meals based on diet preference
        const meals = this.getMealsForDiet(diet, targetCalories);
        
        // Calculate nutrition totals
        const nutrition = meals.reduce((total, meal) => ({
            calories: total.calories + meal.nutrition.calories,
            protein: total.protein + meal.nutrition.protein,
            carbohydrates: total.carbohydrates + meal.nutrition.carbs,
            fat: total.fat + meal.nutrition.fat
        }), { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });

        // Generate shopping list
        const shoppingList = this.generateShoppingList(meals);

        return {
            meals: meals,
            nutrients: nutrition,
            shoppingList: shoppingList
        };
    }

    getMealsForDiet(diet, targetCalories) {
        const caloriesPerMeal = Math.round(targetCalories / 3);
        
        const mealOptions = {
            '': { // No restrictions
                breakfast: [
                    { title: 'Avocado Toast with Eggs', calories: caloriesPerMeal, protein: 18, carbs: 35, fat: 28 },
                    { title: 'Greek Yogurt Parfait', calories: caloriesPerMeal, protein: 20, carbs: 30, fat: 15 },
                    { title: 'Protein Pancakes', calories: caloriesPerMeal, protein: 25, carbs: 25, fat: 20 }
                ],
                lunch: [
                    { title: 'Grilled Chicken Salad', calories: caloriesPerMeal, protein: 32, carbs: 15, fat: 22 },
                    { title: 'Turkey Wrap', calories: caloriesPerMeal, protein: 28, carbs: 40, fat: 18 },
                    { title: 'Salmon with Rice', calories: caloriesPerMeal, protein: 35, carbs: 30, fat: 25 }
                ],
                dinner: [
                    { title: 'Baked Salmon with Vegetables', calories: caloriesPerMeal, protein: 35, carbs: 25, fat: 30 },
                    { title: 'Lean Beef Stir Fry', calories: caloriesPerMeal, protein: 30, carbs: 20, fat: 28 },
                    { title: 'Chicken Pasta', calories: caloriesPerMeal, protein: 28, carbs: 45, fat: 20 }
                ]
            },
            'vegetarian': {
                breakfast: [
                    { title: 'Vegetarian Omelette', calories: caloriesPerMeal, protein: 20, carbs: 15, fat: 25 },
                    { title: 'Quinoa Breakfast Bowl', calories: caloriesPerMeal, protein: 18, carbs: 35, fat: 20 }
                ],
                lunch: [
                    { title: 'Vegetarian Buddha Bowl', calories: caloriesPerMeal, protein: 25, carbs: 40, fat: 20 },
                    { title: 'Caprese Salad', calories: caloriesPerMeal, protein: 20, carbs: 25, fat: 30 }
                ],
                dinner: [
                    { title: 'Vegetarian Pasta', calories: caloriesPerMeal, protein: 22, carbs: 50, fat: 18 },
                    { title: 'Stuffed Bell Peppers', calories: caloriesPerMeal, protein: 18, carbs: 30, fat: 22 }
                ]
            },
            'vegan': {
                breakfast: [
                    { title: 'Vegan Smoothie Bowl', calories: caloriesPerMeal, protein: 15, carbs: 40, fat: 20 },
                    { title: 'Oatmeal with Nuts', calories: caloriesPerMeal, protein: 18, carbs: 35, fat: 25 }
                ],
                lunch: [
                    { title: 'Vegan Buddha Bowl', calories: caloriesPerMeal, protein: 20, carbs: 45, fat: 18 },
                    { title: 'Vegan Wrap', calories: caloriesPerMeal, protein: 15, carbs: 50, fat: 15 }
                ],
                dinner: [
                    { title: 'Tofu Curry', calories: caloriesPerMeal, protein: 25, carbs: 30, fat: 20 },
                    { title: 'Vegan Pasta', calories: caloriesPerMeal, protein: 18, carbs: 55, fat: 15 }
                ]
            },
            'ketogenic': {
                breakfast: [
                    { title: 'Keto Avocado Bowl', calories: caloriesPerMeal, protein: 20, carbs: 8, fat: 45 },
                    { title: 'Keto Pancakes', calories: caloriesPerMeal, protein: 25, carbs: 5, fat: 50 }
                ],
                lunch: [
                    { title: 'Keto Chicken Salad', calories: caloriesPerMeal, protein: 35, carbs: 8, fat: 40 },
                    { title: 'Keto Wrap', calories: caloriesPerMeal, protein: 30, carbs: 6, fat: 45 }
                ],
                dinner: [
                    { title: 'Keto Salmon', calories: caloriesPerMeal, protein: 40, carbs: 5, fat: 50 },
                    { title: 'Keto Beef Bowl', calories: caloriesPerMeal, protein: 35, carbs: 8, fat: 45 }
                ]
            }
        };

        const options = mealOptions[diet] || mealOptions[''];
        
        return [
            {
                type: 'breakfast',
                title: options.breakfast[Math.floor(Math.random() * options.breakfast.length)].title,
                image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400',
                nutrition: options.breakfast[Math.floor(Math.random() * options.breakfast.length)],
                sourceUrl: '#'
            },
            {
                type: 'lunch',
                title: options.lunch[Math.floor(Math.random() * options.lunch.length)].title,
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
                nutrition: options.lunch[Math.floor(Math.random() * options.lunch.length)],
                sourceUrl: '#'
            },
            {
                type: 'dinner',
                title: options.dinner[Math.floor(Math.random() * options.dinner.length)].title,
                image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
                nutrition: options.dinner[Math.floor(Math.random() * options.dinner.length)],
                sourceUrl: '#'
            }
        ];
    }

    generateShoppingList(meals) {
        const ingredients = [
            'Avocado', 'Eggs', 'Whole grain bread', 'Greek yogurt', 'Berries',
            'Chicken breast', 'Mixed greens', 'Tomatoes', 'Cucumber', 'Olive oil',
            'Salmon fillet', 'Broccoli', 'Sweet potato', 'Quinoa', 'Almonds',
            'Spinach', 'Bell peppers', 'Onions', 'Garlic', 'Lemon'
        ];
        
        return ingredients.slice(0, 8).map(ingredient => ({
            name: ingredient,
            amount: Math.floor(Math.random() * 3) + 1,
            unit: 'pieces'
        }));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MealPlanner();
});
