
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { 
  FormatBoldOutlined, 
  FormatItalicOutlined, 
  FormatUnderlinedOutlined, 
  OrderedListOutlined, 
  UnorderedListOutlined, 
  CodeOutlined, 
  QuoteOutlined, 
  AlignLeftOutlined, 
  AlignCenterOutlined, 
  AlignRightOutlined 
} from '@ant-design/icons';
import SelectionService from '../../../services/SelectionService/SelectionService';
import DialogService from '../../../services/DialogService/DialogService';
import ThemeService from '../../../services/ThemeService/ThemeService';

const styles = [
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'paragraph',
  'quote',
  'code',
  'bulletList',
  'numberedList'
];

const styleIcons = {
  heading1: <FormatBoldOutlined />,
  heading2: <FormatItalicOutlined />,
  heading3: <FormatUnderlinedOutlined />,
  heading4: <OrderedListOutlined />,
  heading5: <UnorderedListOutlined />,
  heading6: <CodeOutlined />,
  paragraph: <QuoteOutlined />,
  quote: <AlignLeftOutlined />,
  code: <AlignCenterOutlined />,
  bulletList: <AlignRightOutlined />,
  numberedList: <OrderedListOutlined />
};

/**
 * StyleSection component
 */
class StyleSection extends Component {
  state = {
    currentStyle: 'paragraph'
  };

  componentDidMount() {
    SelectionService.subscribe(this.updateStyle);
  }

  updateStyle = () => {
    const currentStyle = SelectionService.getCurrentStyle();
    this.setState({ currentStyle });
  };

  applyStyle = (style) => {
    try {
      SelectionService.setStyle(style);
      this.setState({ currentStyle: style });
    } catch (error) {
      DialogService.showErrorDialog(`Failed to apply style: ${error.message}`);
    }
  };

  render() {
    const { currentStyle } = this.state;
    const theme = ThemeService.getCurrentTheme();

    return (
      <div className={`style-section ${theme}`}>
        {styles.map((style) => (
          <Tooltip title={style} key={style}>
            <Button
              type={currentStyle === style ? 'primary' : 'default'}
              icon={styleIcons[style]}
              onClick={() => this.applyStyle(style)}
            />
          </Tooltip>
        ))}
      </div>
    );
  }
}

export default StyleSection;
