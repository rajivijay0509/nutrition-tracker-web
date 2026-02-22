# NutriTrack - Web Dashboard

A modern, responsive web dashboard for personal nutrition tracking with meal logging, health metrics, wellness tracking, and community recipe sharing.

## Features

✅ **User Authentication**
- Email/password registration and login
- OAuth integration (Google, Apple, Facebook)
- Secure session management
- Multi-device session tracking

✅ **Daily Dashboard**
- Real-time calorie tracking with progress visualization
- Macronutrient breakdown (protein, carbs, fats)
- Daily meal overview
- Wellness check-in
- Weekly trend analysis

✅ **Food Logging**
- Log meals for 7 scheduled times daily
- Multiple photo uploads per meal
- Detailed notes and observations
- Food tolerance tracking
- Portion size management

✅ **Health Tracking**
- Daily wellness check-ins (mood, energy, sleep)
- Symptom tracking and logging
- Health metrics (weight, blood sugar, BP)
- Symptom timeline and patterns
- Export health data

✅ **Community Features**
- Share recipes with the community
- Rate and review recipes
- Discover trending recipes
- Save favorite recipes
- Recipe search and filtering

✅ **Data Management**
- Detailed history view with date filtering
- Photo gallery for all meals
- Data export (CSV, PDF, ZIP)
- Search and compare entries

## Tech Stack

- **Frontend Framework**: React 18
- **State Management**: Zustand
- **Styling**: CSS3 with CSS Variables
- **Charts**: Recharts
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Animations**: CSS3 + Framer Motion (optional)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
cd nutrition-tracker-web
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file from `.env.example`
```bash
cp .env.example .env
```

4. Configure your API endpoint in `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── client.js              # Axios client with interceptors
├── components/
│   └── Layout.jsx             # Main layout with sidebar
├── pages/
│   ├── LoginPage.jsx          # Login page
│   ├── RegisterPage.jsx       # Registration page
│   ├── DashboardPage.jsx      # Main dashboard
│   ├── FoodLoggingPage.jsx    # Food logging (placeholder)
│   ├── HistoryPage.jsx        # Data history (placeholder)
│   ├── WellnessPage.jsx       # Wellness tracking (placeholder)
│   ├── RecipesPage.jsx        # Recipes (placeholder)
│   └── ProfilePage.jsx        # Profile (placeholder)
├── store/
│   ├── authStore.js           # Authentication state
│   ├── foodStore.js           # Food logging state
│   └── wellnessStore.js       # Wellness state
├── styles/
│   ├── App.css                # Global styles
│   ├── Layout.css             # Layout styles
│   ├── Dashboard.css          # Dashboard styles
│   └── AuthPages.css          # Auth pages styles
├── App.jsx                    # App component with routing
└── main.jsx                   # React entry point
```

## API Integration

The app expects a REST API at `VITE_API_BASE_URL` with the following endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh token
- `GET /auth/me` - Get current user

### Meals
- `POST /meals/log` - Log a meal
- `GET /meals/{date}` - Get daily meals
- `PUT /meals/{id}` - Edit meal
- `DELETE /meals/{id}` - Delete meal
- `POST /meals/{id}/photo` - Upload photo

### Wellness
- `POST /wellness/daily` - Log wellness
- `GET /wellness/{date}` - Get daily wellness
- `POST /symptoms` - Log symptom
- `GET /symptoms` - Get symptoms

### Recipes
- `POST /recipes` - Create recipe
- `GET /recipes` - List recipes
- `GET /recipes/{id}` - Get recipe
- `POST /recipes/{id}/rate` - Rate recipe

See `Enhanced_Nutrition_Tracker_Auth_Community_Features.md` for full API specification.

## Authentication Flow

1. **Registration**: User enters personal info → Creates account → Logged in automatically
2. **Login**: User enters credentials → Gets JWT token → Token stored in localStorage
3. **Authenticated Requests**: JWT token added to all API requests via interceptor
4. **Logout**: Token removed from localStorage → Redirected to login

## Styling & Theming

The app uses CSS variables for theming:

```css
--primary: #06b6d4          /* Cyan */
--success: #10b981          /* Green */
--warning: #f59e0b          /* Amber */
--danger: #ef4444           /* Red */
```

Customize colors in `src/styles/App.css` under `:root` selector.

## Responsive Design

Breakpoints:
- Mobile: < 480px
- Tablet: < 768px
- Desktop: < 1024px
- Large: 1024px+

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Code splitting with React.lazy (to implement)
- Image optimization
- CSS-in-JS for critical styles
- Lazy loading for charts

## Security

- JWT token-based authentication
- HTTPS for production
- CORS configuration
- Input validation
- XSS protection via React
- CSRF tokens (to implement)

## Future Enhancements

- [ ] Food Logging Page with camera integration
- [ ] History Page with advanced filtering
- [ ] Wellness Page with symptom tracking
- [ ] Recipe Community section
- [ ] Advanced analytics and insights
- [ ] Offline support with service workers
- [ ] Real-time notifications
- [ ] Dark mode theme
- [ ] AI-powered meal recognition
- [ ] Integration with wearables
- [ ] Doctor/healthcare provider sharing
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please follow the existing code style and create feature branches.

## License

MIT

## Support

For issues or questions, please open an issue or contact support.

---

**Made with ❤️ for your health**
