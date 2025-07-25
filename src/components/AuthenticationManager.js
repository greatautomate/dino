import React, { useState } from 'react';
import {
  Card,
  Typography,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Divider,
  Progress,
  Descriptions,
  Banner,
  Spin
} from '@douyinfe/semi-ui';
import { 
  IconKey, 
  IconShield, 
  IconRefresh,
  IconEyeOpened,
  IconEyeClosed
} from '@douyinfe/semi-icons';
import { validateTokenFormat, webscoutAPI, nekoAPI } from '../helpers/api';
import { showSuccess, showError } from '../helpers/utils';
import { TOKEN_PATTERNS } from '../constants/common.constant';

const { Title, Text } = Typography;

const AuthenticationManager = () => {
  const [tokens, setTokens] = useState([]);
  const [newToken, setNewToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResults, setValidationResults] = useState({});
  const [showTokens, setShowTokens] = useState({});

  const addToken = () => {
    if (!newToken.trim()) {
      showError('Please enter a token');
      return;
    }

    const validation = validateTokenFormat(newToken);
    if (!validation.valid) {
      showError('Invalid token format. Please enter a valid NewAPI (sk-...) or Webscout (ws_...) token');
      return;
    }

    // Check if token already exists
    if (tokens.some(token => token.value === newToken)) {
      showError('Token already exists');
      return;
    }

    const tokenData = {
      id: Date.now().toString(),
      value: newToken,
      type: validation.type,
      name: `${validation.type.toUpperCase()} Token ${tokens.length + 1}`,
      added: new Date().toISOString(),
      status: 'pending'
    };

    setTokens([...tokens, tokenData]);
    setNewToken('');
    showSuccess('Token added successfully');
  };

  const validateToken = async (tokenData) => {
    setLoading(true);
    try {
      let result;
      
      if (tokenData.type === 'webscout') {
        result = await webscoutAPI.validateToken(tokenData.value);
      } else {
        result = await nekoAPI.queryServers(tokenData.value);
      }
      
      setValidationResults(prev => ({
        ...prev,
        [tokenData.id]: result
      }));
      
      // Update token status
      setTokens(prev => prev.map(token => 
        token.id === tokenData.id 
          ? { ...token, status: 'validated', lastValidated: new Date().toISOString() }
          : token
      ));
      
      showSuccess(`Token ${tokenData.name} validated successfully`);
    } catch (error) {
      showError(`Failed to validate ${tokenData.name}: ` + error.message);
      
      setTokens(prev => prev.map(token => 
        token.id === tokenData.id 
          ? { ...token, status: 'error' }
          : token
      ));
    } finally {
      setLoading(false);
    }
  };

  const validateAllTokens = async () => {
    setLoading(true);
    for (const token of tokens) {
      await validateToken(token);
    }
    setLoading(false);
  };

  const removeToken = (tokenId) => {
    setTokens(prev => prev.filter(token => token.id !== tokenId));
    setValidationResults(prev => {
      const newResults = { ...prev };
      delete newResults[tokenId];
      return newResults;
    });
    showSuccess('Token removed');
  };

  const toggleTokenVisibility = (tokenId) => {
    setShowTokens(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }));
  };

  const maskToken = (token, show) => {
    if (show) return token;
    if (token.startsWith('sk-')) {
      return `sk-${'*'.repeat(44)}${token.slice(-4)}`;
    } else if (token.startsWith('ws_')) {
      return `ws_${'*'.repeat(28)}${token.slice(-4)}`;
    }
    return '*'.repeat(token.length - 4) + token.slice(-4);
  };

  const getTokenStatus = (token) => {
    const result = validationResults[token.id];
    if (!result) return token.status;
    
    if (token.type === 'webscout') {
      return result.status;
    } else {
      // NewAPI - check if any server is valid
      const hasValidServer = Object.values(result).some(server => server.status === 'valid');
      return hasValidServer ? 'valid' : 'invalid';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'green';
      case 'invalid': return 'red';
      case 'error': return 'red';
      case 'pending': return 'grey';
      case 'validated': return 'blue';
      default: return 'grey';
    }
  };

  const renderTokenDetails = (token) => {
    const result = validationResults[token.id];
    if (!result) return null;

    if (token.type === 'webscout') {
      return (
        <Descriptions data={[
          { key: 'Type', value: result.token_type },
          { key: 'Status', value: <Tag color={getStatusColor(result.status)}>{result.status}</Tag> },
          { key: 'User ID', value: result.user_id || 'N/A' },
          { key: 'Permissions', value: result.permissions?.join(', ') || 'N/A' },
          { key: 'Rate Limit', value: result.rate_limit ? `${result.rate_limit.requests_per_minute}/min` : 'N/A' },
          { key: 'Usage Today', value: result.usage ? `${result.usage.requests_today} requests` : 'N/A' }
        ]} />
      );
    } else {
      // NewAPI results
      const validServers = Object.entries(result).filter(([_, server]) => server.status === 'valid');
      const totalBalance = validServers.reduce((sum, [_, server]) => {
        const balance = parseFloat(server.balance) || 0;
        return sum + balance;
      }, 0);

      return (
        <div>
          <Descriptions data={[
            { key: 'Valid Servers', value: `${validServers.length}/${Object.keys(result).length}` },
            { key: 'Total Balance', value: `$${totalBalance.toFixed(2)}` },
            { key: 'Token Type', value: 'NewAPI' }
          ]} />
          
          <Divider />
          
          <Table
            size="small"
            columns={[
              { title: 'Server', dataIndex: 'server', key: 'server' },
              { 
                title: 'Status', 
                dataIndex: 'status', 
                key: 'status',
                render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
              },
              { title: 'Balance', dataIndex: 'balance', key: 'balance', render: (balance) => balance ? `$${balance}` : 'N/A' },
              { title: 'Error', dataIndex: 'error', key: 'error', render: (error) => error || 'None' }
            ]}
            dataSource={Object.entries(result).map(([serverName, serverData], index) => ({
              key: index,
              server: serverName,
              status: serverData.status,
              balance: serverData.balance,
              error: serverData.error
            }))}
            pagination={false}
          />
        </div>
      );
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Tag size="small">{record.type.toUpperCase()}</Tag>
        </div>
      )
    },
    {
      title: 'Token',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text code style={{ fontFamily: 'monospace' }}>
            {maskToken(value, showTokens[record.id])}
          </Text>
          <Button
            size="small"
            type="tertiary"
            icon={showTokens[record.id] ? <IconEyeClosed /> : <IconEyeOpened />}
            onClick={() => toggleTokenVisibility(record.id)}
          />
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = getTokenStatus(record);
        return <Tag color={getStatusColor(status)}>{status}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<IconShield />}
            onClick={() => validateToken(record)}
            loading={loading}
          >
            Validate
          </Button>
          <Button
            size="small"
            type="danger"
            onClick={() => removeToken(record.id)}
          >
            Remove
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Card>
        <Title heading={3}>Authentication Manager</Title>
        <Text type="secondary">
          Manage and validate your API tokens for both NewAPI and Webscout services
        </Text>
        
        <Divider />
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <Input
            value={newToken}
            onChange={setNewToken}
            placeholder="Enter API token (sk-... or ws_...)"
            style={{ flex: 1 }}
            onEnterPress={addToken}
          />
          <Button onClick={addToken} type="primary" icon={<IconKey />}>
            Add Token
          </Button>
          {tokens.length > 0 && (
            <Button 
              onClick={validateAllTokens} 
              icon={<IconRefresh />}
              loading={loading}
            >
              Validate All
            </Button>
          )}
        </div>
        
        <Banner
          fullMode={false}
          type="info"
          bordered
          icon={null}
          closeIcon={null}
          title="Token Format Guide"
          description={
            <div>
              <p><strong>NewAPI tokens:</strong> Start with 'sk-' followed by 48 characters</p>
              <p><strong>Webscout tokens:</strong> Start with 'ws_' followed by 32 characters</p>
            </div>
          }
          style={{ marginBottom: '16px' }}
        />
        
        {tokens.length > 0 ? (
          <Table
            columns={columns}
            dataSource={tokens}
            pagination={false}
            expandedRowRender={(record) => renderTokenDetails(record)}
            size="small"
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">No tokens added yet. Add a token to get started.</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuthenticationManager;
