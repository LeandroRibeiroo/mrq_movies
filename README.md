# BRQ Movies 🎬

A modern React Native movie application built with Expo, featuring user authentication, movie browsing, detailed movie information, and favorites management. 

## 📱 Features

### Core Functionality

- **User Authentication**: Secure JWT-based login system with automatic token management and refresh
- **Movie Discovery**: Browse popular movies with intelligent infinite scrolling and optimized loading
- **Movie Details**: Comprehensive movie information with cast details, genres, ratings, synopsis, and high-quality imagery
- **Favorites Management**: Seamless add/remove functionality with real-time synchronization and persistent storage
- **Cross-Platform Design**: Fully responsive design optimized for iOS, Android, and web platforms
- **Smart Caching**: Intelligent data caching with React Query for offline-first experience
- **Advanced Error Handling**: Comprehensive error boundary system with retry mechanisms and user-friendly messaging
- **Performance Optimization**: New Architecture support with React Compiler for enhanced performance

### User Experience

- **Modern UI**: Clean, intuitive interface with smooth Reanimated-powered animations and gestures
- **Dark Theme**: Sophisticated dark theme design with consistent color palette and typography
- **Advanced Loading States**: Beautiful loading indicators, skeleton screens, and progressive image loading
- **Pull-to-Refresh**: Intuitive content refresh with haptic feedback and smooth animations
- **Enhanced Interactions**: Rich haptic feedback, gesture handling, and edge-to-edge display support
- **Accessibility**: Full accessibility support with proper labeling and navigation
- **Type Safety**: Complete TypeScript integration with typed routes for enhanced developer experience

## 🏗️ Architecture

```
src/
├── app/                           # Expo Router file-based routing with typed routes
│   ├── _layout.tsx               # Root layout with providers and navigation
│   ├── index.tsx                 # App entry point with auth routing
│   ├── (logged-out)/             # Authentication route group
│   │   ├── _layout.tsx           # Auth layout
│   │   └── index.tsx             # Sign-in screen
│   └── (protected)/              # Protected route group
│       ├── _layout.tsx           # Protected layout with tab navigation
│       ├── index.tsx             # Home screen
│       └── details.tsx           # Movie details screen
├── shared/                        # Shared application resources
│   ├── components/               # Reusable UI components
│   │   ├── CustomInput/          # Form input with validation
│   │   ├── ErrorBoundary/        # Global error handling
│   │   └── ErrorComponent/       # Error display component
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useAuthInit.ts        # Auth initialization
│   │   ├── useErrorHandler.ts    # Error handling hook
│   │   └── services/             # Hook-specific services
│   ├── interfaces/               # Shared TypeScript interfaces
│   │   ├── auth-response.ts      # Authentication types
│   │   ├── movie.ts              # Movie data types
│   │   ├── favorite-response.ts  # Favorites types
│   │   └── api-error.ts          # Error types
│   ├── providers/                # Context providers
│   ├── services/                 # Shared API services
│   ├── store/                    # Zustand state management
│   │   ├── authStore.ts          # Authentication state
│   │   └── [other stores]        # Feature-specific stores
│   └── theme/                    # Styling and theme configuration
└── screens/                      # Domain-organized screen components
    ├── logged-out/
    │   └── SignIn/               # Authentication domain
    │       ├── SignIn.tsx        # Main sign-in component
    │       ├── hooks/            # Auth-specific hooks
    │       ├── services/         # Auth API services
    │       └── interfaces/       # Auth type definitions
    └── protected/
        ├── Home/                 # Movie browsing domain
        │   ├── HomeScreen.tsx    # Movie list with infinite scroll
        │   ├── hooks/            # Home-specific hooks
        │   └── services/         # Movie API services
        ├── Details/              # Movie details domain
        │   ├── DetailsScreen.tsx # Movie details view
        │   ├── hooks/            # Details-specific hooks
        │   └── services/         # Details API services
        └── Favorites/            # Favorites domain
            ├── FavoritesScreen.tsx # Favorites list view
            ├── hooks/            # Favorites-specific hooks
            └── services/         # Favorites API services
```

### 🎯 SOLID Principles Implementation

- **Single Responsibility Principle (SRP)**: Each service, interface, and component has a single, well-defined responsibility
- **Open/Closed Principle (OCP)**: Components are open for extension but closed for modification
- **Liskov Substitution Principle (LSP)**: Interfaces are properly implemented across all components
- **Interface Segregation Principle (ISP)**: Domain-specific interfaces are separated by functionality
- **Dependency Inversion Principle (DIP)**: High-level modules depend on abstractions, not concretions

## 🛠️ Tech Stack

### Core Framework

- **React Native**: `0.81.4` - Mobile app development framework with New Architecture enabled
- **React**: `19.1.0` - JavaScript library for building user interfaces
- **Expo**: `~54.0.10` - Development platform and toolchain with React Compiler experiments
- **TypeScript**: `~5.9.2` - Static type checking with typed routes

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
- **React Native Edge-to-Edge**: `^1.7.0` - Edge-to-edge display support
- **Expo Image**: `~3.0.8` - Optimized image component
- **Expo Symbols**: `~1.0.7` - Symbol rendering system

### Forms & Validation

- **React Hook Form**: `^7.63.0` - Form state management
- **Yup**: `^1.7.1` - Schema validation

### Data & Storage

- **Axios**: `^1.12.2` - HTTP client for API requests
- **React Native MMKV**: `^3.3.3` - Fast key-value storage
- **React Native Config**: `1.5.6` - Environment configuration
- **React Native Worklets**: `0.5.1` - JavaScript worklets for performance
- **React Native Nitro Modules**: `^0.29.6` - High-performance native modules

### Development & Testing

- **Jest**: `^30.1.3` - Testing framework
- **React Testing Library**: `^13.3.3` - Component testing utilities
- **ESLint**: `^9.25.0` - Code linting and formatting
- **Axios Mock Adapter**: `^2.1.0` - HTTP mocking for tests
- **Jest Expo**: `~54.0.12` - Jest configuration for Expo projects

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
npm run lint          # Run ESLint code analysis
npm test              # Run Jest test suite
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:verbose  # Run tests with detailed output
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
- **New Architecture**: React Native's new architecture for improved performance
- **React Compiler**: Experimental React Compiler for automatic optimizations
- **Worklets**: JavaScript worklets for high-performance animations and computations
- **Nitro Modules**: High-performance native modules for critical operations
- **Image Optimization**: Efficient image loading and caching with Expo Image
- **Edge-to-Edge**: Modern edge-to-edge display support
- **Code Splitting**: Lazy loading of screens and components
- **Memory Management**: Proper cleanup of resources
- **Bundle Optimization**: Minimized app size
- **SOLID Architecture**: Maintainable and scalable code structure
- **Domain-Driven Design**: Clear separation of concerns for better performance
- **TypeScript**: Compile-time error detection and optimization with typed routes

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
