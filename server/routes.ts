import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse, generateWelcomeMessage } from "./services/gemini";
import { insertChatSessionSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new chat session
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      
      // Generate welcome message for the scenario and language
      const welcomeMessage = await generateWelcomeMessage(sessionData.scenario, sessionData.language || 'en-US');
      
      // Add welcome message to chat
      await storage.addChatMessage({
        sessionId: session.id,
        sender: 'ai',
        message: welcomeMessage
      });
      
      res.json(session);
    } catch (error) {
      console.error('Error creating chat session:', error);
      res.status(400).json({ message: 'Failed to create chat session' });
    }
  });

  // Get chat session
  app.get("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error fetching chat session:', error);
      res.status(500).json({ message: 'Failed to fetch chat session' });
    }
  });

  // Get chat messages for a session
  app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ message: 'Failed to fetch chat messages' });
    }
  });

  // Send message and get AI response
  app.post("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId
      });

      // Save user message
      const userMessage = await storage.addChatMessage(messageData);
      
      // Get session to determine scenario and language
      const session = await storage.getChatSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Chat session not found' });
      }

      // Get AI response with language support
      const aiResponse = await getChatResponse(messageData.message, session.scenario, session.language || 'en-US');
      
      // Save AI response
      const aiMessage = await storage.addChatMessage({
        sessionId: req.params.sessionId,
        sender: 'ai',
        message: aiResponse
      });

      res.json({
        userMessage,
        aiMessage
      });
    } catch (error) {
      console.error('Error processing chat message:', error);
      res.status(500).json({ message: 'Failed to process message' });
    }
  });

  // Get user's chat sessions
  app.get("/api/chat/sessions", async (req, res) => {
    try {
      const sessions = await storage.getUserChatSessions();
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      res.status(500).json({ message: 'Failed to fetch chat sessions' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
