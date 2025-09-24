# BRQ Movies 🎬

A modern React Native movie application built with Expo, featuring user authentication, movie browsing, detailed movie information, and favorites management.

## 📱 Features

### Core Functionality

- **User Authentication**: Secure login system with JWT token management
- **Movie Discovery**: Browse popular movies with infinite scrolling
- **Movie Details**: Comprehensive movie information including cast, genres, ratings, and synopsis
- **Favorites Management**: Add/remove movies from personal favorites list
- **Responsive Design**: Optimized for both iOS and Android platforms
- **Offline Support**: Cached data for improved performance
- **Error Handling**: Comprehensive error management with user-friendly messages

### User Experience

- **Modern UI**: Clean, intuitive interface with smooth animations
- **Dark Theme**: Eye-friendly dark theme design
- **Loading States**: Beautiful loading indicators and skeleton screens
- **Pull-to-Refresh**: Easy content refresh functionality
- **Haptic Feedback**: Enhanced user interaction with haptic responses

## 🏗️ Architecture

```
src/
├── app/                           # Expo Router file-based routing
│   ├── (logged-out)/             # Authentication screens
│   └── (protected)/              # Authenticated user screens
├── components/                    # Reusable UI components
│   ├── CustomInput/              # Form input component
│   ├── ErrorBoundary/            # Error handling component
│   └── ErrorComponent/           # Error display component
├── hooks/                         # Custom React hooks
├── interfaces/                    # Shared TypeScript interfaces
├── providers/                     # Context providers
├── screens/                       # Screen components organized by domain
│   ├── logged-out/
│   │   └── SignIn/               # Authentication domain
│   │       ├── interface/        # Auth-specific interfaces
│   │       ├── services/         # Auth-specific services
│   │       └── hooks/            # Auth-specific hooks
│   └── protected/
│       ├── Home/                 # Movie browsing domain
│       │   ├── interface/        # Movie interfaces
│       │   └── services/         # Movie services
│       ├── Details/              # Movie details domain
│       │   ├── interface/        # Movie details interfaces
│       │   └── services/         # Movie details services
│       └── Favorites/            # Favorites domain
│           ├── interface/        # Favorites interfaces
│           └── services/         # Favorites services
├── services/                      # Shared API services
├── store/                         # Zustand state management
└── theme/                         # Styling and theme configuration
```

### 🎯 SOLID Principles Implementation

- **Single Responsibility Principle (SRP)**: Each service, interface, and component has a single, well-defined responsibility
- **Open/Closed Principle (OCP)**: Components are open for extension but closed for modification
- **Liskov Substitution Principle (LSP)**: Interfaces are properly implemented across all components
- **Interface Segregation Principle (ISP)**: Domain-specific interfaces are separated by functionality
- **Dependency Inversion Principle (DIP)**: High-level modules depend on abstractions, not concretions

## 🛠️ Tech Stack

### Core Framework

- **React Native**: `0.81.4` - Mobile app development framework
- **Expo**: `~54.0.10` - Development platform and toolchain
- **TypeScript**: `~5.9.2` - Static type checking

### Navigation & Routing

- **Expo Router**: `~6.0.8` - File-based routing system
- **React Navigation**: Bottom tabs and native stack navigation

### State Management

- **Zustand**: `^5.0.8` - Lightweight state management
- **TanStack Query**: `^5.90.2` - Server state management and caching

### UI & Styling

- **React Native Unistyles**: `^3.0.13` - Universal styling system
- **Expo Vector Icons**: `^15.0.2` - Icon library
- **React Native Reanimated**: `~4.1.0` - Advanced animations
- **React Native Gesture Handler**: `~2.28.0` - Touch gesture system

### Forms & Validation

- **React Hook Form**: `^7.63.0` - Form state management
- **Yup**: `^1.7.1` - Schema validation

### Data & Storage

- **Axios**: `^1.12.2` - HTTP client for API requests
- **React Native MMKV**: `^3.3.3` - Fast key-value storage
- **React Native Config**: `1.5.6` - Environment configuration

### Development & Testing

- **Jest**: `^30.1.3` - Testing framework
- **React Testing Library**: `^13.3.3` - Component testing utilities
- **ESLint**: `^9.25.0` - Code linting and formatting

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mrq_movies
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   API_BASE_URL=https://movies-db-production-0420.up.railway.app
   ```

4. **Login Credentials**
   Use the following credentials to log in to the app:

   - **Username**: `user`
   - **Password**: `12345678`

5. **Start the development server**
   ```bash
   npm start
   ```

### Running on Devices

- **iOS Simulator**: `npm run ios`
- **Android Emulator**: `npm run android`
- **Web Browser**: `npm run web`

## 🧪 Testing

The application includes comprehensive testing coverage with **131 tests** across **5 test suites**, achieving **100% test success rate**:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

```

### 📊 Test Coverage

- **✅ SignIn Tests**: Authentication flow and form validation
- **✅ useSignIn Hook Tests**: Custom hook functionality with React Query integration
- **✅ HomeScreen Tests**: Movie browsing with infinite scroll and navigation
- **✅ DetailsScreen Tests**: Movie details display and favorites toggle
- **✅ FavoritesScreen Tests**: Favorites management and navigation

### 🧪 Test Structure

- **Unit Tests**: Individual component and hook testing with comprehensive mocking
- **Screen Tests**: Complete screen functionality testing with QueryClient integration
- **Mock Strategy**: Inline mocks for better Jest compatibility and maintainability

### 🔧 Testing Technologies

- **Jest**: Testing framework with comprehensive configuration
- **React Testing Library**: Component testing utilities
- **React Native Testing Library**: Mobile-specific testing helpers
- **TanStack Query Testing**: QueryClient integration for React Query testing
- **Mocking**: Comprehensive mocking of external dependencies (Expo Router, MMKV, etc.)

## 📡 API Integration

The app integrates with a movie database API providing:

### Authentication Endpoints

- `POST /api/auth/signin` - User authentication

### Movie Endpoints

- `GET /api/movies/popular?page={page}` - Popular movies with pagination
- `GET /api/movies/{movieId}` - Detailed movie information

### Favorites Endpoints

- `GET /api/movies/favorites/list` - User's favorite movies
- `POST /api/movies/favorites` - Add movie to favorites
- `DELETE /api/movies/favorites/{movieId}` - Remove from favorites
- `GET /api/movies/favorites/check/{movieId}` - Check if movie is favorited

## 🎨 UI/UX Design

### Design System

- **Color Palette**: Dark theme with orange accent colors
- **Typography**: Roboto font family
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable, accessible UI components

### Screen Structure

1. **Authentication Flow**

   - Sign-in screen with form validation
   - Secure token management

2. **Main Application**
   - Home: Popular movies grid with infinite scroll
   - Details: Full movie information with favorites toggle
   - Favorites: Personal movie collection

## 🔧 Development Scripts

```bash
npm start              # Start Expo development server
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator
npm run web           # Run on web browser
npm run lint          # Run ESLint
npm run reset-project # Reset to blank project template
```

## 📱 Platform Support

- **iOS**: iOS 13.0+
- **Android**: API level 21+ (Android 5.0+)
- **Web**: Modern browsers with ES6+ support

## 🔐 Security Features

- JWT token-based authentication
- Secure token storage using MMKV
- Automatic token refresh handling
- Network error handling and retry logic
- Input validation and sanitization

## 📈 Performance Optimizations

- **React Query**: Intelligent caching and background updates
- **Image Optimization**: Efficient image loading and caching
- **Code Splitting**: Lazy loading of screens and components
- **Memory Management**: Proper cleanup of resources
- **Bundle Optimization**: Minimized app size
- **SOLID Architecture**: Maintainable and scalable code structure
- **Domain-Driven Design**: Clear separation of concerns for better performance
- **TypeScript**: Compile-time error detection and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- The Movie Database (TMDB) for movie data
- Expo team for the excellent development platform
- React Native community for continuous improvements
- All contributors and testers

---

**Built with ❤️ using React Native and Expo**
