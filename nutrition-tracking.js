// Nutrition Tracking JavaScript
class NutritionTracker {
    constructor() {
        this.nutritionChart = null;
        this.weeklyChart = null;
        this.dailyNutrition = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };
        this.goals = {
            calories: 2000,
            protein: 150,
            carbs: 250,
            fat: 65
        };
        this.todaysMeals = [];
        this.weeklyData = [];
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.loadData();
        this.initializeCharts();
        this.updateDisplay();
    }

    bindEvents() {
        document.getElementById('mealLogForm').addEventListener('submit', (e) => this.handleMealLog(e));
        document.getElementById('goalsForm').addEventListener('submit', (e) => this.handleGoalsSubmit(e));
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleTheme());
    }

    handleMealLog(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const meal = {
            id: Date.now(),
            type: document.getElementById('mealType').value,
            name: document.getElementById('foodName').value,
            calories: parseInt(document.getElementById('calories').value) || 0,
            protein: parseFloat(document.getElementById('protein').value) || 0,
            carbs: parseFloat(document.getElementById('carbs').value) || 0,
            fat: parseFloat(document.getElementById('fat').value) || 0,
            timestamp: new Date().toISOString()
        };

        this.addMeal(meal);
        this.updateDisplay();
        this.saveData();
        
        // Reset form
        e.target.reset();
    }

    handleGoalsSubmit(e) {
        e.preventDefault();
        
        this.goals = {
            calories: parseInt(document.getElementById('calorieGoal').value) || 2000,
            protein: parseInt(document.getElementById('proteinGoal').value) || 150,
            carbs: parseInt(document.getElementById('carbsGoal').value) || 250,
            fat: parseInt(document.getElementById('fatGoal').value) || 65
        };

        this.updateDisplay();
        this.saveData();
        
        // Show success message
        this.showToast('Goals updated successfully!', 'success');
    }

    addMeal(meal) {
        this.todaysMeals.push(meal);
        
        // Update daily nutrition totals
        this.dailyNutrition.calories += meal.calories;
        this.dailyNutrition.protein += meal.protein;
        this.dailyNutrition.carbs += meal.carbs;
        this.dailyNutrition.fat += meal.fat;
    }

    removeMeal(mealId) {
        const mealIndex = this.todaysMeals.findIndex(meal => meal.id === mealId);
        if (mealIndex !== -1) {
            const meal = this.todaysMeals[mealIndex];
            
            // Subtract from daily totals
            this.dailyNutrition.calories -= meal.calories;
            this.dailyNutrition.protein -= meal.protein;
            this.dailyNutrition.carbs -= meal.carbs;
            this.dailyNutrition.fat -= meal.fat;
            
            // Remove from array
            this.todaysMeals.splice(mealIndex, 1);
            
            this.updateDisplay();
            this.saveData();
        }
    }

    updateDisplay() {
        // Update summary cards
        document.getElementById('dailyCalories').textContent = this.dailyNutrition.calories;
        document.getElementById('dailyProtein').textContent = `${this.dailyNutrition.protein}g`;
        document.getElementById('dailyCarbs').textContent = `${this.dailyNutrition.carbs}g`;
        document.getElementById('dailyFat').textContent = `${this.dailyNutrition.fat}g`;

        // Update progress bars
        this.updateProgressBar('caloriesProgress', this.dailyNutrition.calories, this.goals.calories);
        this.updateProgressBar('proteinProgress', this.dailyNutrition.protein, this.goals.protein);
        this.updateProgressBar('carbsProgress', this.dailyNutrition.carbs, this.goals.carbs);
        this.updateProgressBar('fatProgress', this.dailyNutrition.fat, this.goals.fat);

        // Update goal displays
        document.getElementById('caloriesGoal').textContent = `Goal: ${this.goals.calories} kcal`;
        document.getElementById('proteinGoal').textContent = `Goal: ${this.goals.protein}g`;
        document.getElementById('carbsGoal').textContent = `Goal: ${this.goals.carbs}g`;
        document.getElementById('fatGoal').textContent = `Goal: ${this.goals.fat}g`;

        // Update charts
        this.updateNutritionChart();
        this.updateWeeklyChart();

        // Update today's meals list
        this.updateTodaysMeals();
    }

    updateProgressBar(elementId, current, goal) {
        const percentage = Math.min((current / goal) * 100, 100);
        const element = document.getElementById(elementId);
        if (element) {
            element.style.width = `${percentage}%`;
        }
    }

    updateTodaysMeals() {
        const container = document.getElementById('todaysMeals');
        
        if (this.todaysMeals.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No meals logged today</p>';
            return;
        }

        container.innerHTML = this.todaysMeals.map(meal => `
            <div class="meal-item border-bottom pb-2 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${meal.name}</h6>
                        <small class="text-muted">${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</small>
                        <div class="nutrition-info mt-1">
                            <small class="text-danger me-2">${meal.calories} cal</small>
                            <small class="text-warning me-2">${meal.protein}g P</small>
                            <small class="text-info me-2">${meal.carbs}g C</small>
                            <small class="text-primary">${meal.fat}g F</small>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" onclick="nutritionTracker.removeMeal(${meal.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                </div>
            </div>
        `).join('');
    }

    initializeCharts() {
        // Nutrition breakdown chart
        const nutritionCtx = document.getElementById('nutritionChart');
        if (nutritionCtx) {
            this.nutritionChart = new Chart(nutritionCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Protein', 'Carbohydrates', 'Fat'],
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

        // Weekly progress chart
        const weeklyCtx = document.getElementById('weeklyChart');
        if (weeklyCtx) {
            this.weeklyChart = new Chart(weeklyCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Calories Consumed',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Calorie Goal',
                        data: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        borderDash: [5, 5],
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Calories'
                            }
                        }
                    }
                }
            });
        }
    }

    updateNutritionChart() {
        if (this.nutritionChart) {
            const total = this.dailyNutrition.protein + this.dailyNutrition.carbs + this.dailyNutrition.fat;
            
            if (total > 0) {
                this.nutritionChart.data.datasets[0].data = [
                    this.dailyNutrition.protein,
                    this.dailyNutrition.carbs,
                    this.dailyNutrition.fat
                ];
            } else {
                this.nutritionChart.data.datasets[0].data = [0, 0, 0];
            }
            
            this.nutritionChart.update();
        }
    }

    updateWeeklyChart() {
        if (this.weeklyChart) {
            // Generate sample weekly data
            const weeklyCalories = this.generateWeeklyData();
            
            this.weeklyChart.data.datasets[0].data = weeklyCalories;
            this.weeklyChart.data.datasets[1].data = Array(7).fill(this.goals.calories);
            
            this.weeklyChart.update();
        }
    }

    generateWeeklyData() {
        // Generate realistic weekly data based on current day
        const today = new Date();
        const dayOfWeek = today.getDay();
        const baseCalories = this.dailyNutrition.calories;
        
        const weeklyData = [];
        for (let i = 0; i < 7; i++) {
            if (i === dayOfWeek) {
                weeklyData.push(baseCalories);
            } else {
                // Generate random data for other days
                const variation = (Math.random() - 0.5) * 400; // ±200 calories
                weeklyData.push(Math.max(800, baseCalories + variation));
            }
        }
        
        return weeklyData;
    }

    saveData() {
        const data = {
            dailyNutrition: this.dailyNutrition,
            goals: this.goals,
            todaysMeals: this.todaysMeals,
            weeklyData: this.weeklyData
        };
        
        localStorage.setItem('nutritionTracker_data', JSON.stringify(data));
    }

    loadData() {
        const saved = localStorage.getItem('nutritionTracker_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.dailyNutrition = data.dailyNutrition || this.dailyNutrition;
            this.goals = data.goals || this.goals;
            this.todaysMeals = data.todaysMeals || [];
            this.weeklyData = data.weeklyData || [];
        }

        // Load goals into form
        document.getElementById('calorieGoal').value = this.goals.calories;
        document.getElementById('proteinGoal').value = this.goals.protein;
        document.getElementById('carbsGoal').value = this.goals.carbs;
        document.getElementById('fatGoal').value = this.goals.fat;
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
let nutritionTracker;
document.addEventListener('DOMContentLoaded', () => {
    nutritionTracker = new NutritionTracker();
});
