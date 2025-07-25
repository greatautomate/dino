import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Button, 
  Select, 
  Spin, 
  Image,
  Divider,
  Space,
  Tag
} from '@douyinfe/semi-ui';
import { 
  IconSearch, 
  IconImage, 
  IconVolumeUp, 
  IconSun 
} from '@douyinfe/semi-icons';
import { webscoutAPI } from '../helpers/api';
import { 
  ENABLE_SEARCH, 
  ENABLE_IMAGE_GEN, 
  ENABLE_TTS, 
  ENABLE_WEATHER 
} from '../constants/common.constant';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const WebscoutFeatures = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const [ttsText, setTtsText] = useState('');
  const [ttsVoice, setTtsVoice] = useState('default');
  const [ttsResult, setTtsResult] = useState(null);
  const [ttsLoading, setTtsLoading] = useState(false);

  const [weatherLocation, setWeatherLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const response = await webscoutAPI.search(searchQuery, searchEngine, 10);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    
    setImageLoading(true);
    try {
      const response = await webscoutAPI.generateImage({ prompt: imagePrompt });
      setGeneratedImages(response.data);
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!ttsText.trim()) return;
    
    setTtsLoading(true);
    try {
      const response = await webscoutAPI.textToSpeech({ 
        input: ttsText, 
        voice: ttsVoice 
      });
      setTtsResult(response.data);
    } catch (error) {
      console.error('Text-to-speech failed:', error);
    } finally {
      setTtsLoading(false);
    }
  };

  const handleWeatherQuery = async () => {
    if (!weatherLocation.trim()) return;
    
    setWeatherLoading(true);
    try {
      const response = await webscoutAPI.getWeather(weatherLocation);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Weather query failed:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Title heading={3}>Webscout Features</Title>
      
      {/* Web Search */}
      {ENABLE_SEARCH && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <IconSearch style={{ marginRight: '8px' }} />
            <Title heading={4} style={{ margin: 0 }}>Web Search</Title>
          </div>
          
          <Space vertical style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Enter search query..."
                style={{ flex: 1 }}
                onEnterPress={handleSearch}
              />
              <Select
                value={searchEngine}
                onChange={setSearchEngine}
                style={{ width: '120px' }}
                optionList={[
                  { value: 'google', label: 'Google' },
                  { value: 'duckduckgo', label: 'DuckDuckGo' },
                  { value: 'yep', label: 'Yep' }
                ]}
              />
              <Button 
                onClick={handleSearch} 
                loading={searchLoading}
                type="primary"
              >
                Search
              </Button>
            </div>
            
            {searchResults && (
              <div>
                <Text type="secondary">
                  Found {searchResults.total_results} results in {searchResults.search_time}s
                </Text>
                <div style={{ marginTop: '12px' }}>
                  {searchResults.results?.map((result, index) => (
                    <Card key={index} style={{ marginBottom: '8px' }}>
                      <Title heading={5}>
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          {result.title}
                        </a>
                      </Title>
                      <Text type="secondary">{result.snippet}</Text>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Space>
        </Card>
      )}

      {/* Image Generation */}
      {ENABLE_IMAGE_GEN && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <IconImage style={{ marginRight: '8px' }} />
            <Title heading={4} style={{ margin: 0 }}>Image Generation</Title>
          </div>
          
          <Space vertical style={{ width: '100%' }}>
            <TextArea
              value={imagePrompt}
              onChange={setImagePrompt}
              placeholder="Describe the image you want to generate..."
              rows={3}
            />
            <Button 
              onClick={handleImageGeneration} 
              loading={imageLoading}
              type="primary"
            >
              Generate Image
            </Button>
            
            {generatedImages && (
              <div>
                <Text strong>Generated Images:</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {generatedImages.images?.map((image, index) => (
                    <Image
                      key={index}
                      src={image.url}
                      width={200}
                      height={200}
                      style={{ borderRadius: '8px' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Space>
        </Card>
      )}

      {/* Text-to-Speech */}
      {ENABLE_TTS && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <IconVolumeUp style={{ marginRight: '8px' }} />
            <Title heading={4} style={{ margin: 0 }}>Text-to-Speech</Title>
          </div>
          
          <Space vertical style={{ width: '100%' }}>
            <TextArea
              value={ttsText}
              onChange={setTtsText}
              placeholder="Enter text to convert to speech..."
              rows={3}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Select
                value={ttsVoice}
                onChange={setTtsVoice}
                style={{ width: '150px' }}
                optionList={[
                  { value: 'default', label: 'Default' },
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
              />
              <Button 
                onClick={handleTextToSpeech} 
                loading={ttsLoading}
                type="primary"
              >
                Generate Speech
              </Button>
            </div>
            
            {ttsResult && (
              <div>
                <Text strong>Generated Audio:</Text>
                <audio controls style={{ width: '100%', marginTop: '8px' }}>
                  <source src={ttsResult.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <Text type="secondary">Duration: {ttsResult.duration}s</Text>
              </div>
            )}
          </Space>
        </Card>
      )}

      {/* Weather */}
      {ENABLE_WEATHER && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <IconSun style={{ marginRight: '8px' }} />
            <Title heading={4} style={{ margin: 0 }}>Weather Information</Title>
          </div>
          
          <Space vertical style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                value={weatherLocation}
                onChange={setWeatherLocation}
                placeholder="Enter city or location..."
                style={{ flex: 1 }}
                onEnterPress={handleWeatherQuery}
              />
              <Button 
                onClick={handleWeatherQuery} 
                loading={weatherLoading}
                type="primary"
              >
                Get Weather
              </Button>
            </div>
            
            {weatherData && (
              <Card style={{ background: 'var(--semi-color-fill-0)' }}>
                <Title heading={5}>{weatherData.location}</Title>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <Tag size="large">{weatherData.temperature}</Tag>
                  <Tag size="large" color="blue">{weatherData.condition}</Tag>
                  <Tag size="large" color="green">Humidity: {weatherData.humidity}</Tag>
                  <Tag size="large" color="orange">Wind: {weatherData.wind}</Tag>
                </div>
              </Card>
            )}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default WebscoutFeatures;
