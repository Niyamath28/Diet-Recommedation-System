# 🍴 Diet Recommendation Web App

A comprehensive full-stack web application that generates personalized diet plans using the Spoonacular API. Built with modern web technologies, this app provides meal planning, nutrition tracking, recipe discovery, and user profile management.

## 🌟 Features

### 📊 **Calorie-Based Meal Planning**
- Generate personalized daily meal plans based on target calorie intake
- Support for various dietary preferences (vegetarian, vegan, keto, paleo, etc.)
- Real-time nutrition calculations and breakdowns
- Interactive shopping list generation

### 🥗 **Dietary Preferences**
- **Vegetarian** - Plant-based meals with dairy and eggs
- **Vegan** - Completely plant-based meals
- **Ketogenic** - Low-carb, high-fat meals
- **Paleo** - Whole foods, no processed ingredients
- **Mediterranean** - Heart-healthy Mediterranean diet
- **Gluten-Free** - Safe for celiac and gluten sensitivity
- **Dairy-Free** - Lactose-free meal options

### 🧾 **Nutrition Tracking**
- Daily nutrition summary with visual progress bars
- Interactive charts for macronutrient breakdown
- Meal logging system with detailed nutrition info
- Weekly progress visualization
- BMI calculator and health metrics
- Goal setting and progress tracking

### 🍽 **Recipe Database**
- Advanced search and filtering capabilities
- Category-based browsing (breakfast, lunch, dinner, snacks)
- Detailed recipe information with nutritional data
- Recipe rating and difficulty indicators
- Dietary preference badges
- Pagination for large result sets

### 👤 **User Profile Management**
- Personal information and health goals
- Activity level and dietary preferences
- Progress tracking with charts and analytics
- Meal history and statistics
- App settings and preferences
- Data export functionality

## 🛠 Tech Stack

### **Frontend Technologies**
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern styling with CSS variables and animations
- **Bootstrap 5.3.3** - Responsive grid system and components
- **JavaScript ES6+** - Modern JavaScript with classes and async/await
- **Chart.js** - Interactive data visualization
- **Font Awesome 6.4.0** - Comprehensive icon library

### **API Integration**
- **Spoonacular API** - Real meal and recipe data
- **Error handling** - Graceful fallbacks for API failures
- **Demo data** - Fallback content when API is unavailable

### **Features**
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Dark Mode Support** - Theme switching capability
- ✅ **Local Storage** - Data persistence across sessions
- ✅ **Form Validation** - Real-time input validation
- ✅ **Toast Notifications** - User feedback system
- ✅ **Loading States** - Smooth user experience
- ✅ **Accessibility** - ARIA labels and keyboard navigation

## 📁 Project Structure

```
demo full stack/
├── homepage.html              # Landing page with hero section
├── meal-planning.html         # Meal plan generator
├── meal-planning.js           # JavaScript for meal planning
├── nutrition-tracking.html    # Nutrition tracking page
├── nutrition-tracking.js      # JavaScript for nutrition tracking
├── recipe-database.html       # Recipe search page
├── recipe-database.js         # JavaScript for recipe database
├── user-profile.html          # User profile page
├── user-profile.js            # JavaScript for user profile
├── styles.css                 # Shared CSS styles
└── api-test.html              # API testing utility
```

## 🚀 Getting Started

### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls
- Spoonacular API key (optional - demo data available)

### **Installation**

1. **Clone or Download** the project files
2. **Get Spoonacular API Key** (optional):
   - Sign up at [spoonacular.com](https://spoonacular.com/food-api)
   - Get your free API key
   - Replace `YOUR_SPOONACULAR_API_KEY` in the JavaScript files

3. **Deploy** to any web server:
   - **GitHub Pages** - Upload to a GitHub repository
   - **Netlify** - Drag and drop the folder
   - **Vercel** - Connect your GitHub repository
   - **Local Server** - Use Live Server extension in VS Code

### **Quick Start**

1. **Open `homepage.html`** in your browser
2. **Navigate** through the 5 main pages:
   - Homepage - Overview and features
   - Meal Planning - Generate meal plans
   - Nutrition Tracking - Track daily intake
   - Recipe Database - Discover recipes
   - User Profile - Manage preferences

## 📖 Usage Guide

### **1. Homepage**
- Overview of all features
- Navigation to different sections
- Feature highlights and benefits

### **2. Meal Planning**
1. Enter your target daily calories (e.g., 2000 kcal)
2. Select your diet preference (vegetarian, vegan, etc.)
3. Add any ingredients to exclude
4. Choose time frame (daily or weekly)
5. Click "Generate Meal Plan"
6. View your personalized meal plan with nutrition info

### **3. Nutrition Tracking**
1. Set your daily nutrition goals
2. Log meals throughout the day
3. Track progress with visual charts
4. Monitor weekly trends
5. Adjust goals as needed

### **4. Recipe Database**
1. Search for specific recipes
2. Filter by diet type, cuisine, calories, or time
3. Browse featured categories
4. View detailed recipe information
5. Add recipes to your meal plan

### **5. User Profile**
1. Enter personal information (age, weight, height)
2. Set health goals and activity level
3. Configure dietary preferences
4. Track your progress over time
5. Export your data

## 🔧 Configuration

### **API Setup**
The app uses the Spoonacular API for real meal and recipe data. To use the full functionality:

1. **Get API Key**: Sign up at [spoonacular.com](https://spoonacular.com/food-api)
2. **Update JavaScript Files**: Replace the API key in:
   - `meal-planning.js` (line 4)
   - `recipe-database.js` (line 4)

### **Customization**
- **Colors**: Modify CSS variables in `styles.css`
- **Features**: Add new functionality in respective JavaScript files
- **Styling**: Update Bootstrap classes or custom CSS

## 🧪 Testing

### **API Testing**
Use the included `api-test.html` file to test your API connection:

1. Open `api-test.html` in your browser
2. Click "Test API Key" to verify connection
3. Test meal plan generation
4. Test recipe search functionality

### **Demo Mode**
The app includes demo data that works without an API key, allowing you to test all features offline.

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🌙 Dark Mode

Toggle dark mode using the theme button in the navigation bar. The preference is saved in local storage.

## 💾 Data Storage

All user data is stored locally in the browser using:
- **Local Storage** - User preferences and settings
- **Session Storage** - Temporary data during session
- **No Backend Required** - Pure frontend application

## 🔒 Privacy & Security

- **No Data Collection** - All data stays in your browser
- **No Tracking** - No analytics or user tracking
- **Local Storage Only** - Data never leaves your device
- **API Key Security** - Keep your Spoonacular API key private

## 🐛 Troubleshooting

### **Common Issues**

1. **"Failed to generate meal plan"**
   - Check your internet connection
   - Verify your API key is correct
   - Check browser console for error messages
   - Try the demo mode (works without API)

2. **CORS Errors**
   - Run from a local server instead of opening files directly
   - Use Live Server extension in VS Code
   - Deploy to a web server

3. **API Rate Limits**
   - Free Spoonacular accounts have daily limits
   - Wait for the next day or upgrade your plan
   - Use demo mode for testing

4. **Charts Not Displaying**
   - Ensure Chart.js is loaded
   - Check browser console for JavaScript errors
   - Try refreshing the page

### **Browser Compatibility**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

Feel free to contribute to this project:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Spoonacular** - For providing the comprehensive food API
- **Bootstrap** - For the responsive framework
- **Chart.js** - For interactive charts
- **Font Awesome** - For the icon library
- **Unsplash** - For demo images

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the troubleshooting section
2. **Test** with the API test page
3. **Review** browser console for errors
4. **Try** demo mode for offline testing

## 🔮 Future Enhancements

- [ ] Backend integration for data persistence
- [ ] User authentication and accounts
- [ ] Social features and sharing
- [ ] Mobile app development
- [ ] Advanced analytics and insights
- [ ] Integration with fitness trackers
- [ ] Meal prep planning
- [ ] Grocery delivery integration

---

**Built with ❤️ for healthy living and better nutrition tracking!**

🍴 **Start your health journey today!** 🍴
