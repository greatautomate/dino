import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Button, 
  Tabs, 
  TabPane, 
  Space, 
  Spin, 
  Badge,
  Divider,
  Table,
  Tag,
  Toast
} from '@douyinfe/semi-ui';
import { 
  IconSearch, 
  IconDownload, 
  IconSettings, 
  IconApps,
  IconKey,
  IconCloud,
  IconShield,
  IconComment
} from '@douyinfe/semi-icons';
import Papa from 'papaparse';
import { nekoAPI, validateTokenFormat, webscoutAPI } from '../helpers/api';
import { showSuccess, showError } from '../helpers/utils';
import { 
  BASE_URL, 
  SHOW_BALANCE, 
  SHOW_DETAIL,
  ENABLE_WEBSCOUT,
  TOKEN_PATTERNS
} from '../constants/common.constant';
import ProviderSelector from './ProviderSelector';
import ProviderManagement from './ProviderManagement';
import AuthenticationManager from './AuthenticationManager';
import ChatInterface from './ChatInterface';
import WebscoutFeatures from './WebscoutFeatures';

const { Title, Text } = Typography;

const EnhancedLogsTable = () => {
  const [apikey, setAPIKey] = useState('');
  const [activeTabKey, setActiveTabKey] = useState('token-query');
  const [loading, setLoading] = useState(false);
  const [tokenResults, setTokenResults] = useState({});
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');

  const validateAndQueryToken = async () => {
    if (!apikey.trim()) {
      showError('Please enter an API key');
      return;
    }

    const tokenValidation = validateTokenFormat(apikey);
    if (!tokenValidation.valid) {
      showError('Invalid token format. Please enter a valid NewAPI (sk-...) or Webscout (ws_...) token');
      return;
    }

    setLoading(true);
    try {
      const results = await nekoAPI.queryServers(apikey);
      setTokenResults(results);
      showSuccess(`Token validated successfully (${tokenValidation.type} format)`);
    } catch (error) {
      showError('Failed to validate token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!tokenResults || Object.keys(tokenResults).length === 0) {
      showError('No data to export');
      return;
    }

    const exportData = [];
    Object.entries(tokenResults).forEach(([serverName, result]) => {
      exportData.push({
        server: serverName,
        status: result.status,
        balance: result.balance || 'N/A',
        error: result.error || 'N/A',
        token_type: result.token_type || 'N/A'
      });
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `token-validation-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Results exported successfully');
  };

  const renderTokenResults = () => {
    if (!tokenResults || Object.keys(tokenResults).length === 0) {
      return null;
    }

    const columns = [
      {
        title: 'Server',
        dataIndex: 'server',
        key: 'server',
        render: (text) => <Text strong>{text}</Text>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          const colorMap = {
            valid: 'green',
            invalid: 'red',
            error: 'red',
            timeout: 'orange',
            unsupported: 'grey'
          };
          return <Tag color={colorMap[status] || 'grey'}>{status}</Tag>;
        }
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        render: (balance) => balance ? `$${balance}` : 'N/A'
      },
      {
        title: 'Token Type',
        dataIndex: 'token_type',
        key: 'token_type',
        render: (type) => type ? <Tag>{type}</Tag> : 'N/A'
      },
      {
        title: 'Error',
        dataIndex: 'error',
        key: 'error',
        render: (error) => error ? <Text type="danger">{error}</Text> : 'None'
      }
    ];

    const dataSource = Object.entries(tokenResults).map(([serverName, result], index) => ({
      key: index,
      server: serverName,
      status: result.status,
      balance: result.balance,
      token_type: result.token_type,
      error: result.error
    }));

    return (
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title heading={4}>Validation Results</Title>
          <Button 
            icon={<IconDownload />} 
            onClick={exportResults}
            type="tertiary"
          >
            Export CSV
          </Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={dataSource}
          pagination={false}
          size="small"
        />
      </div>
    );
  };

  const handleProviderChange = (provider, model) => {
    setSelectedProvider(provider);
    setSelectedModel(model);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title heading={2}>Neko API Key Tool - Enhanced with Webscout</Title>
        <Text type="secondary">
          Validate API keys across multiple servers and access 90+ AI providers with additional features
        </Text>
        
        <Divider />
        
        <Tabs 
          activeKey={activeTabKey} 
          onChange={setActiveTabKey}
          type="line"
        >
          <TabPane
            tab={
              <span>
                <IconKey style={{ marginRight: '4px' }} />
                Token Query
              </span>
            }
            itemKey="token-query"
          >
            <Space vertical style={{ width: '100%' }}>
              <AuthenticationManager />
            </Space>
          </TabPane>

          <TabPane
            tab={
              <span>
                <IconShield style={{ marginRight: '4px' }} />
                Quick Validation
              </span>
            }
            itemKey="quick-validation"
          >
            <Space vertical style={{ width: '100%' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  API Key
                </Text>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    value={apikey}
                    onChange={setAPIKey}
                    placeholder="Enter your API key (sk-... for NewAPI or ws_... for Webscout)"
                    style={{ flex: 1 }}
                    onEnterPress={validateAndQueryToken}
                  />
                  <Button 
                    onClick={validateAndQueryToken} 
                    loading={loading}
                    type="primary"
                    icon={<IconSearch />}
                  >
                    Validate
                  </Button>
                </div>
                
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Text type="secondary" size="small">
                    Supported servers: {Object.keys(BASE_URL).join(', ')}
                  </Text>
                </div>
              </div>
              
              {renderTokenResults()}
            </Space>
          </TabPane>

          {ENABLE_WEBSCOUT && (
            <TabPane
              tab={
                <span>
                  <IconSettings style={{ marginRight: '4px' }} />
                  AI Providers
                </span>
              }
              itemKey="providers"
            >
              <ProviderSelector
                onProviderChange={handleProviderChange}
                selectedProvider={selectedProvider}
              />
            </TabPane>
          )}

          {ENABLE_WEBSCOUT && (
            <TabPane
              tab={
                <span>
                  <IconCloud style={{ marginRight: '4px' }} />
                  Provider Management
                </span>
              }
              itemKey="management"
            >
              <ProviderManagement />
            </TabPane>
          )}

          {ENABLE_WEBSCOUT && (
            <TabPane
              tab={
                <span>
                  <IconComment style={{ marginRight: '4px' }} />
                  AI Chat
                </span>
              }
              itemKey="chat"
            >
              <ChatInterface />
            </TabPane>
          )}

          {ENABLE_WEBSCOUT && (
            <TabPane
              tab={
                <span>
                  <IconApps style={{ marginRight: '4px' }} />
                  Webscout Features
                </span>
              }
              itemKey="features"
            >
              <WebscoutFeatures />
            </TabPane>
          )}
        </Tabs>
      </Card>
    </div>
  );
};

export default EnhancedLogsTable;
