
import React, { Component } from 'react';
import { Button, Tooltip } from 'antd';
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4, LuHeading5, LuHeading6, LuQuote, LuCode2, LuList } from "react-icons/lu";
import { PiParagraph, PiListNumbers } from "react-icons/pi";
import SelectionService from '../../../../services/Selection_service/SelectionService';
import DialogService from '../../../../services/dialog_service/DialogService';
import ThemeService from '../../../../services/Theme_service/ThemeService';

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
  heading1: <LuHeading1 />,
  heading2: <LuHeading2 />,
  heading3: <LuHeading3 />,
  heading4: <LuHeading4 />,
  heading5: <LuHeading5 />,
  heading6: <LuHeading6 />,
  paragraph: <PiParagraph />,
  quote: <LuQuote />,
  code: <LuCode2 />,
  bulletList: <LuList />,
  numberedList: <PiListNumbers />
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
          <Tooltip title={style} key={style} placement='bottom'>
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
