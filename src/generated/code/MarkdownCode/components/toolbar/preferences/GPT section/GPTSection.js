
import React, { Component } from 'react';
import { DialogService } from 'MarkdownCode/services/dialog service/DialogService';
import { SelectionService } from 'MarkdownCode/services/Selection service/SelectionService';
import { GptService } from 'MarkdownCode/services/gpt service/GptService';
import { CompressService } from 'MarkdownCode/services/compress service/CompressService';
import { ThemeService } from 'MarkdownCode/services/Theme service/ThemeService';
import KeyButton from 'MarkdownCode/components/toolbar/preferences/GPT section/KeyButton';
import ModelComboBox from 'MarkdownCode/components/toolbar/preferences/GPT section/ModelComboBox';
import { Layout } from 'antd';

class GPTSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: ThemeService.getCurrentTheme()
        };
    }

    componentDidMount() {
        this.updateTheme();
    }

    updateTheme() {
        const theme = ThemeService.getCurrentTheme();
        this.setState({ theme });
    }

    showErrorDialog(error) {
        DialogService.showErrorDialog('An error occurred', error.message);
    }

    render() {
        const { theme } = this.state;
        return (
            <Layout className={`gpt-section ${theme}`}>
                <KeyButton theme={theme} />
                <ModelComboBox theme={theme} />
            </Layout>
        );
    }
}

export default GPTSection;
