# Backend Types

This directory contains all TypeScript interfaces and types used across the backend application.

## File Structure

- `index.ts` - Main types file containing all interfaces

## Type Categories

### Error Types
- `CustomError` - Extended Error interface with optional status code

### Auth Types
- `LoginCredentials` - Login request payload
- `SignupCredentials` - Signup request payload  
- `AuthResponse` - Authentication response structure

### User Types
- `UserData` - User model interface
- `JWTPayload` - JWT token payload structure

### API Response Types
- `ApiResponse<T>` - Generic API response wrapper
- `ErrorResponse` - Error response structure

## Usage

```typescript
import type { CustomError, LoginCredentials } from "../types/index.js";
```

## Guidelines

1. **Add new interfaces here** instead of creating them in individual files
2. **Use descriptive names** that clearly indicate the purpose
3. **Group related types** together with comments
4. **Export all types** from index.ts
5. **Use generic types** where applicable for reusability