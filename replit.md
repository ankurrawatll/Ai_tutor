# SpeakGenie - AI Voice Tutor

## Overview

SpeakGenie is a React-based web application that serves as an AI voice tutor for children aged 6-16. The application provides two main interaction modes: free-flow AI chatbot conversations and structured roleplay scenarios. It leverages the Google Gemini API for AI responses and browser-native Web Speech APIs for voice input/output functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with Vite as the build tool and bundler. The application follows a modern component-based architecture with the following key characteristics:

- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and data fetching
- **UI Components**: Comprehensive set of Radix UI primitives with custom styling

### Backend Architecture
The backend follows a simple Express.js server architecture with the following design:

- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for chat session and message management
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **AI Integration**: Google Gemini API for generating conversational responses
- **Session Management**: Chat sessions with scenario-based context management

### Database Design
Currently uses an in-memory storage system with a well-defined interface that can be easily replaced with a persistent database:

- **Users**: Basic user management with username/password
- **Chat Sessions**: Session tracking with scenario and language preferences
- **Chat Messages**: Message history with sender identification and timestamps

The schema is defined using Drizzle ORM with PostgreSQL dialect, indicating preparation for future database integration.

## Key Components

### Voice Processing System
- **Speech Recognition**: Browser-native Web Speech API for converting speech to text
- **Speech Synthesis**: Browser-native Text-to-Speech for AI response playback
- **Language Support**: English (default) and Hindi language options
- **Audio Feedback**: Real-time audio level monitoring and visual feedback

### AI Conversation Engine
- **Scenario-Based Prompts**: Different conversation contexts (school, store, restaurant, airport, home)
- **Fallback Responses**: Predefined responses for error handling and conversation continuity
- **Welcome Messages**: Scenario-specific introduction messages
- **Context Awareness**: Maintains conversation context within chat sessions

### UI/UX Design
- **Modern Interface**: Gradient backgrounds, glass morphism effects, and animated elements
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Visual Feedback**: Loading states, error handling, and success confirmations

## Data Flow

1. **Session Initialization**: User selects a scenario or starts free chat
2. **Session Creation**: Backend creates new chat session with scenario context
3. **Voice Input**: User speaks, browser converts to text via Speech Recognition API
4. **AI Processing**: Text sent to Gemini API with scenario-specific prompts
5. **Response Generation**: AI generates age-appropriate response
6. **Voice Output**: Response played back via Speech Synthesis API
7. **Message Storage**: Conversation history stored in session

## External Dependencies

### Core Dependencies
- **Google Gemini API**: Primary AI service for conversation generation
- **Radix UI**: Accessible UI component primitives
- **TanStack React Query**: Server state management and caching
- **Tailwind CSS**: Utility-first CSS framework
- **Drizzle ORM**: Type-safe database toolkit (prepared for PostgreSQL)

### Browser APIs
- **Web Speech API**: Speech Recognition and Speech Synthesis
- **Media Devices API**: Microphone access and audio level monitoring

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

The application is configured for multiple deployment environments:

### Development
- Vite development server with hot module replacement
- Express.js backend with middleware logging
- In-memory storage for rapid development iteration

### Production
- Vite build process generating optimized static assets
- Express.js serving both API endpoints and static files
- ESBuild bundling for server-side code
- Environment variable configuration for API keys

### Infrastructure Requirements
- Node.js runtime environment
- PostgreSQL database (when moving from in-memory storage)
- Environment variables for Gemini API key
- HTTPS support for Web Speech API functionality

The modular architecture allows for easy scaling and deployment to various platforms including traditional servers, serverless functions, or container-based solutions.