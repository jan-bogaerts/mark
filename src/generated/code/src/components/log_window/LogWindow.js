import React, { Component } from 'react';
import { List, Typography, ConfigProvider, theme } from 'antd';
import ThemeService from '../../services/Theme_service/ThemeService';

const { defaultAlgorithm, darkAlgorithm } = theme;

class LogWindow extends Component {
  constructor(props) {
    super(props);
    this.rootRef = React.createRef();
    this.endRef = React.createRef();
    this.state = {
      logMsgs: [],
    };
    this.handleLogMsg = this.handleLogMsg.bind(this);
  }

  componentDidMount() {
    window.electron.onLogMsg(this.handleLogMsg);
  }

  componentWillUnmount() {
    window.electron.removeOnLogMsg(this.handleLogMsg);
  }

  handleLogMsg(event, msg) {
    const logObject = JSON.parse(msg);
    const isAtEnd = this.rootRef.current.scrollHeight - this.rootRef.current.scrollTop === this.rootRef.current.clientHeight;
    if (logObject.response) {
      this.setState(prevState => {
        const logMsgs = prevState.logMsgs.map(log => {
          if (log.key === logObject.key) {
            return { ...log, response: logObject.response };
          }
          return log;
        });
        return { logMsgs };
      });
    } else {
      this.setState(prevState => ({
        logMsgs: [...prevState.logMsgs, logObject],
      }));
    }
    if (isAtEnd) {
      setTimeout(() => {
        this.endRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  render() {
    const theme = ThemeService.getCurrentTheme();
    return (
      <ConfigProvider theme={{
        algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
      }}>
        <div className='os-draggable'/>
        <div ref={this.rootRef} className={`log-window ${theme}`} style={{ overflow: 'auto', height: '100%' }}>
          <List
            size="small"
            bordered
            dataSource={this.state.logMsgs}
            renderItem={log => (
              <List.Item>
                <Typography.Text style={{ whiteSpace: 'pre-wrap' }}>
                  <strong>{log.location}</strong><br />
                  <strong>{log.transformerName}</strong><br />
                  Model: {log.inputData.model}<br />
                  Max Tokens: {log.inputData.max_tokens}<br />
                  Temperature: {log.inputData.temperature}<br />
                  {log.inputData.messages.map((item, index) => (
                    <span key={index}>
                      <strong>{item.role}</strong>:<br /> {item.content}<br />
                    </span>
                  ))}
                  {log.response && (
                    <>
                      <strong>Response:</strong><br />
                      {log.response}<br />
                      <hr />
                    </>
                  )}
                </Typography.Text>
              </List.Item>
            )}
          />
          <div ref={this.endRef} />
        </div>
      </ConfigProvider>
    );
  }
}

export default LogWindow;