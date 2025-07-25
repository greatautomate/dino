import React from 'react';
import EnhancedLogsTable from '../../components/EnhancedLogsTable';
import { ThemeProvider } from '../../context/Theme';

const Token = () => (
  <ThemeProvider>
    <EnhancedLogsTable />
  </ThemeProvider>
);

export default Token;
