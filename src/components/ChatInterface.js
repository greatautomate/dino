import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Button, 
  Select, 
  Space, 
  Divider,
  Avatar,
  Tag,
  Spin,
  Toast
} from '@douyinfe/semi-ui';
import { 
  IconSend, 
  IconUser, 
  IconRobot,
  IconRefresh,
  IconSettings
} from '@douyinfe/semi-icons';
import { webscoutAPI } from '../helpers/api';
import { showError } from '../helpers/utils';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [models, setModels] = useState({});
  const [chatSettings, setChatSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000,
    systemMessage: 'You are a helpful AI assistant.'
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProviders();
    fetchModels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchProviders = async () => {
    try {
      const response = await webscoutAPI.getProviders();
      setProviders(response.data);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await webscoutAPI.getModels();
      setModels(response.data);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      provider: selectedProvider,
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Prepare messages for API
      const apiMessages = [
        { role: 'system', content: chatSettings.systemMessage },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: inputMessage }
      ];

      const response = await webscoutAPI.chatCompletions({
        model: selectedModel,
        messages: apiMessages,
        temperature: chatSettings.temperature,
        max_tokens: chatSettings.maxTokens
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.choices[0].message.content,
        timestamp: new Date().toISOString(),
        provider: selectedProvider,
        model: selectedModel,
        usage: response.data.usage
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      showError('Failed to send message: ' + error.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date().toISOString(),
        provider: selectedProvider,
        model: selectedModel,
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const getProviderOptions = () => {
    if (!providers.providers) return [];
    return providers.providers.map(provider => ({
      value: provider,
      label: provider.charAt(0).toUpperCase() + provider.slice(1)
    }));
  };

  const getModelOptions = () => {
    if (!selectedProvider || !models.providers?.[selectedProvider]?.models) return [];
    return models.providers[selectedProvider].models.map(model => ({
      value: model,
      label: model
    }));
  };

  const renderMessage = (message) => {
    const isUser = message.role === 'user';
    const isError = message.error;

    return (
      <div
        key={message.id}
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: '16px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            maxWidth: '70%',
            flexDirection: isUser ? 'row-reverse' : 'row'
          }}
        >
          <Avatar
            size="small"
            style={{
              backgroundColor: isUser ? 'var(--semi-color-primary)' : 'var(--semi-color-success)',
              flexShrink: 0
            }}
          >
            {isUser ? <IconUser /> : <IconRobot />}
          </Avatar>
          
          <div
            style={{
              backgroundColor: isUser 
                ? 'var(--semi-color-primary)' 
                : isError 
                  ? 'var(--semi-color-danger-light-default)'
                  : 'var(--semi-color-fill-1)',
              color: isUser ? 'white' : 'var(--semi-color-text-0)',
              padding: '12px 16px',
              borderRadius: '12px',
              wordBreak: 'break-word'
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              {message.content}
            </div>
            
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
              <Tag size="small" type="light">
                {message.provider}
              </Tag>
              <Tag size="small" type="light">
                {message.model}
              </Tag>
              {message.usage && (
                <Tag size="small" type="light">
                  {message.usage.total_tokens} tokens
                </Tag>
              )}
              <Text 
                size="small" 
                type="tertiary"
                style={{ color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--semi-color-text-2)' }}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title heading={3}>AI Chat Interface</Title>
          <Space>
            <Select
              value={selectedProvider}
              onChange={(value) => {
                setSelectedProvider(value);
                // Reset model when provider changes
                const firstModel = models.providers?.[value]?.models?.[0];
                if (firstModel) setSelectedModel(firstModel);
              }}
              style={{ width: '150px' }}
              optionList={getProviderOptions()}
            />
            <Select
              value={selectedModel}
              onChange={setSelectedModel}
              style={{ width: '200px' }}
              optionList={getModelOptions()}
              disabled={!selectedProvider}
            />
            <Button 
              icon={<IconRefresh />} 
              onClick={clearChat}
              type="tertiary"
            >
              Clear
            </Button>
          </Space>
        </div>

        <Divider />

        {/* Messages Area */}
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '16px',
            backgroundColor: 'var(--semi-color-fill-0)',
            borderRadius: '8px',
            marginBottom: '16px'
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Text type="secondary">
                Start a conversation with {selectedProvider} using {selectedModel}
              </Text>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar size="small" style={{ backgroundColor: 'var(--semi-color-success)' }}>
                  <IconRobot />
                </Avatar>
                <div style={{ 
                  backgroundColor: 'var(--semi-color-fill-1)',
                  padding: '12px 16px',
                  borderRadius: '12px'
                }}>
                  <Spin size="small" />
                  <Text style={{ marginLeft: '8px' }}>Thinking...</Text>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <TextArea
            value={inputMessage}
            onChange={setInputMessage}
            placeholder="Type your message here..."
            autosize={{ minRows: 1, maxRows: 4 }}
            style={{ flex: 1 }}
            onEnterPress={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage}
            type="primary"
            icon={<IconSend />}
            loading={loading}
            disabled={!inputMessage.trim()}
          >
            Send
          </Button>
        </div>

        <Text size="small" type="tertiary" style={{ marginTop: '8px' }}>
          Press Enter to send, Shift+Enter for new line
        </Text>
      </Card>
    </div>
  );
};

export default ChatInterface;
