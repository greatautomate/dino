import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Table, 
  Tag, 
  Button, 
  Input, 
  Select, 
  Modal, 
  Form, 
  Space,
  Spin,
  Badge,
  Tooltip,
  Divider
} from '@douyinfe/semi-ui';
import { 
  IconSearch, 
  IconSettings, 
  IconPlay, 
  IconRefresh,
  IconInfoCircle
} from '@douyinfe/semi-icons';
import { webscoutAPI } from '../helpers/api';
import { showSuccess, showError } from '../helpers/utils';

const { Title, Text } = Typography;

const ProviderManagement = () => {
  const [providers, setProviders] = useState([]);
  const [models, setModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
    fetchProviders();
    fetchModels();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await webscoutAPI.getProviders();
      setProviders(response.data);
    } catch (error) {
      showError('Failed to fetch providers: ' + error.message);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await webscoutAPI.getModels();
      setModels(response.data);
      setLoading(false);
    } catch (error) {
      showError('Failed to fetch models: ' + error.message);
      setLoading(false);
    }
  };

  const testProvider = async (provider, model) => {
    setTestLoading(true);
    try {
      const testMessage = [
        { role: "user", content: "Hello! Please respond with a simple greeting." }
      ];
      
      const response = await webscoutAPI.chatCompletions({
        model: model || provider,
        messages: testMessage,
        max_tokens: 50
      });
      
      showSuccess(`${provider} test successful!`);
      return response.data;
    } catch (error) {
      showError(`${provider} test failed: ` + error.message);
      return null;
    } finally {
      setTestLoading(false);
    }
  };

  const getFilteredProviders = () => {
    if (!providers.providers) return [];
    
    let filtered = providers.providers;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(provider => 
        provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && providers.categories) {
      const categoryProviders = providers.categories[selectedCategory] || [];
      filtered = filtered.filter(provider => categoryProviders.includes(provider));
    }
    
    return filtered;
  };

  const getProviderStatus = (provider) => {
    const providerModels = models.providers?.[provider];
    if (!providerModels) return 'unknown';
    if (providerModels.error) return 'error';
    if (providerModels.count > 0) return 'available';
    return 'unavailable';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'green';
      case 'error': return 'red';
      case 'unavailable': return 'orange';
      default: return 'grey';
    }
  };

  const getProviderCategory = (provider) => {
    if (!providers.categories) return 'other';
    
    for (const [category, categoryProviders] of Object.entries(providers.categories)) {
      if (categoryProviders.includes(provider)) {
        return category;
      }
    }
    return 'other';
  };

  const columns = [
    {
      title: 'Provider',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text strong style={{ textTransform: 'capitalize' }}>{name}</Text>
          <Badge 
            count={getProviderCategory(name)} 
            type="secondary" 
            size="small"
          />
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const status = getProviderStatus(record.name);
        return <Tag color={getStatusColor(status)}>{status}</Tag>;
      }
    },
    {
      title: 'Models',
      dataIndex: 'models',
      key: 'models',
      render: (_, record) => {
        const providerModels = models.providers?.[record.name];
        const count = providerModels?.count || 0;
        return (
          <Tooltip content={providerModels?.models?.join(', ') || 'No models available'}>
            <Badge count={count} type="primary" />
          </Tooltip>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<IconPlay />}
            onClick={() => {
              setSelectedProvider(record.name);
              setTestModalVisible(true);
            }}
          >
            Test
          </Button>
          <Button 
            size="small" 
            icon={<IconInfoCircle />}
            type="tertiary"
            onClick={() => {
              // Show provider details
              Modal.info({
                title: `${record.name} Details`,
                content: (
                  <div>
                    <p><strong>Category:</strong> {getProviderCategory(record.name)}</p>
                    <p><strong>Status:</strong> {getProviderStatus(record.name)}</p>
                    <p><strong>Models:</strong> {models.providers?.[record.name]?.count || 0}</p>
                    {models.providers?.[record.name]?.error && (
                      <p><strong>Error:</strong> {models.providers[record.name].error}</p>
                    )}
                  </div>
                )
              });
            }}
          >
            Info
          </Button>
        </Space>
      )
    }
  ];

  const dataSource = getFilteredProviders().map(provider => ({
    key: provider,
    name: provider
  }));

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: '16px' }}>
            Loading providers and models...
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title heading={3}>Provider Management</Title>
            <Text type="secondary">
              Manage and test {providers.count || 0} AI providers with {models.total_models || 0} total models
            </Text>
          </div>
          <Button 
            icon={<IconRefresh />} 
            onClick={() => {
              setLoading(true);
              fetchProviders();
              fetchModels();
            }}
          >
            Refresh
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Input
            prefix={<IconSearch />}
            placeholder="Search providers..."
            value={searchTerm}
            onChange={setSearchTerm}
            style={{ width: '300px' }}
          />
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: '150px' }}
            optionList={[
              { value: 'all', label: 'All Categories' },
              { value: 'major', label: 'Major' },
              { value: 'free', label: 'Free' },
              { value: 'specialized', label: 'Specialized' },
              { value: 'experimental', label: 'Experimental' }
            ]}
          />
        </div>

        <Table 
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          size="small"
        />
      </Card>

      {/* Test Provider Modal */}
      <Modal
        title={`Test ${selectedProvider}`}
        visible={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          onSubmit={async (values) => {
            const result = await testProvider(selectedProvider, values.model);
            if (result) {
              setTestModalVisible(false);
            }
          }}
        >
          <Form.Select
            field="model"
            label="Model"
            placeholder="Select a model to test"
            optionList={
              models.providers?.[selectedProvider]?.models?.map(model => ({
                value: model,
                label: model
              })) || []
            }
            rules={[{ required: true, message: 'Please select a model' }]}
          />
          
          <Form.TextArea
            field="message"
            label="Test Message"
            placeholder="Enter a test message..."
            defaultValue="Hello! Please respond with a simple greeting."
            rows={3}
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button onClick={() => setTestModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              htmlType="submit" 
              type="primary" 
              loading={testLoading}
            >
              Test Provider
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProviderManagement;
