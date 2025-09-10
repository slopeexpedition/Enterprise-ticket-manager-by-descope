import React, { useState } from 'react';
import { Container, Paper, TextField, Button, List, ListItem, Typography } from '@mui/material';
import { useSession } from '@descope/react-sdk';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { sessionToken } = useSession();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Here you would integrate with your backend chatbot API
      const response = await axios.post('http://localhost:8000/tickets/search', 
        { query: input },
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );

      // Format the response into a readable message
      const botResponse = {
        text: formatBotResponse(response.data),
        isUser: false
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error processing your request.',
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInput('');
  };

  const formatBotResponse = (data: any[]) => {
    if (data.length === 0) {
      return "I couldn't find any tickets matching your query.";
    }

    return `I found ${data.length} ticket(s) matching your query:\n` +
      data.map(ticket => `Ticket #${ticket.id}: ${ticket.status} - ${ticket.description}`).join('\n');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ justifyContent: message.isUser ? 'flex-end' : 'flex-start' }}>
              <Paper 
                sx={{ 
                  p: 1, 
                  bgcolor: message.isUser ? '#e3f2fd' : '#f5f5f5',
                  maxWidth: '70%'
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', gap: '8px' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your tickets..."
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default ChatBot;
