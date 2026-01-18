# Testing Setup Instructions

## 📝 Note About Test File Errors

The test files (`ArticlesPage.test.tsx` and `utils.tsx`) show TypeScript errors about missing `@testing-library/react` and `jest`. **This is normal and expected** because testing dependencies haven't been installed yet.

---

## 🛠️ How to Set Up Testing (When Ready)

The test files are provided as **reference and templates** to demonstrate clean testing practices. When you're ready to add testing to your project, follow these steps:

### **Step 1: Install Testing Dependencies**

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @types/jest jest jest-environment-jsdom
npm install --save-dev ts-jest
```

### **Step 2: Create Jest Configuration**

Create `jest.config.js` in your frontend root:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### **Step 3: Create Jest Setup File**

Create `jest.setup.js` in your frontend root:

```javascript
import '@testing-library/jest-dom';

// Mock fetch if not available in test environment
global.fetch = jest.fn();
```

### **Step 4: Update package.json**

Add test scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### **Step 5: Update tsconfig.json**

Ensure your `tsconfig.json` includes jest types:

```json
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

---

## ✅ After Setup

Once dependencies are installed, the TypeScript errors will disappear and you can run:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 🎯 What the Test Files Demonstrate

Even though they show errors now, the test files demonstrate:

1. ✅ **Clean test structure** (Given/When/Then)
2. ✅ **Descriptive naming** (`should_display_articles_when_data_loaded`)
3. ✅ **AAA pattern** (Arrange/Act/Assert)
4. ✅ **Test factories** (createArticle, createMenuItems, etc.)
5. ✅ **Parameterized tests** (test.each)
6. ✅ **Proper mocking** (mockApiSuccess, mockApiError)

---

## 📚 For Now

You can:
- ✅ **Use test files as templates** when you set up testing
- ✅ **Reference the structure** for how to write clean tests
- ✅ **Copy the patterns** to other test files
- ✅ **Ignore the TypeScript errors** - they're expected

---

## 🚀 When to Set Up Testing

Consider setting up testing when:
- You want to ensure code quality before deployment
- You're working on critical business logic
- You want to prevent regression bugs
- Your team is ready to adopt TDD practices

---

**The test files are production-ready templates waiting for testing infrastructure!** 🧪
