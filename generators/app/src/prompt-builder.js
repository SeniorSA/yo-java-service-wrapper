const chalk = require('chalk');

module.exports = class PromptBuilder {

    constructor(frameworkConfig) {
        this.frameworkConfig = frameworkConfig;
        this.wrapperConfigDefaultValues = [];
    }

    withDefaultValues(wrapperConfigDefaultValues) {
        this.wrapperConfigDefaultValues.push(wrapperConfigDefaultValues);
        return this;
    }

    build() {
        this.wrapperConfigDefaultValues.forEach(defaults => {
            this.frameworkConfig.applyPromptsDefaultValues(defaults);
        });

        return this.frameworkConfig.prompts
            .map(frameworkPrompt => this._buildCliPromptFor(frameworkPrompt))
    }

    _buildCliPromptFor(frameworkPrompt) {
        const promptQuestion = { ...frameworkPrompt };
        if (!promptQuestion.type) {
            promptQuestion.type = frameworkPrompt.choices ? 'list' : 'input';
        }
        promptQuestion.message = `${chalk.bold(frameworkPrompt.message)}${chalk.red(frameworkPrompt.required ? ' *' : '')}`;

        if (frameworkPrompt.required && !frameworkPrompt.default && typeof promptQuestion.validate !== 'function') {
            promptQuestion.validate = input => input !== '';
        }

        return promptQuestion;
    }

}
