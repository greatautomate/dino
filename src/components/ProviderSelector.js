import React, { useState, useEffect } from 'react';
import { Select, Card, Typography, Spin, Badge, Divider } from '@douyinfe/semi-ui';
import { webscoutAPI } from '../helpers/api';

const { Title, Text } = Typography;

const ProviderSelector = ({ onProviderChange, selectedProvider }) => {
  const [providers, setProviders] = useState([]);
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    fetchProviders();
    fetchModels();
  }, []);

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
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      setLoading(false);
    }
  };

  const handleProviderChange = (provider) => {
    onProviderChange(provider, selectedModel);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    onProviderChange(selectedProvider, model);
  };

  const getProviderOptions = () => {
    if (!providers.providers) return [];
    
    return providers.providers.map(provider => ({
      value: provider,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ textTransform: 'capitalize' }}>{provider}</span>
          <Badge 
            count={models.providers?.[provider]?.count || 0} 
            type="secondary" 
            size="small"
          />
        </div>
      )
    }));
  };

  const getModelOptions = () => {
    if (!selectedProvider || !models.providers?.[selectedProvider]?.models) return [];
    
    return models.providers[selectedProvider].models.map(model => ({
      value: model,
      label: model
    }));
  };

  if (loading) {
    return (
      <Card style={{ margin: '16px 0' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: '10px' }}>
            Loading providers and models...
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ margin: '16px 0' }}>
      <Title heading={4}>AI Provider Selection</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        Choose from {providers.count || 0} available AI providers with {models.total_models || 0} total models
      </Text>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Provider
          </Text>
          <Select
            value={selectedProvider}
            onChange={handleProviderChange}
            placeholder="Select AI Provider"
            style={{ width: '100%' }}
            optionList={getProviderOptions()}
            filter
          />
        </div>
        
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Model
          </Text>
          <Select
            value={selectedModel}
            onChange={handleModelChange}
            placeholder="Select Model"
            style={{ width: '100%' }}
            optionList={getModelOptions()}
            disabled={!selectedProvider}
            filter
          />
        </div>
      </div>

      {selectedProvider && (
        <>
          <Divider />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Badge count="Major" type="primary" />
            {providers.categories?.major?.includes(selectedProvider) && (
              <Badge count="Major Provider" type="primary" />
            )}
            {providers.categories?.free?.includes(selectedProvider) && (
              <Badge count="Free" type="success" />
            )}
            {providers.categories?.specialized?.includes(selectedProvider) && (
              <Badge count="Specialized" type="warning" />
            )}
            {providers.categories?.experimental?.includes(selectedProvider) && (
              <Badge count="Experimental" type="tertiary" />
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default ProviderSelector;
