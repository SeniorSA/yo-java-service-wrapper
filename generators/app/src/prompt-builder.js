const chalk = require('chalk');

module.exports = class PromptBuilder {

    constructor(frameworkConfig) {
        this.frameworkConfig = frameworkConfig;
    }

    withDefaultValues(wrapperConfigDefaultValues) {
        this.wrapperConfigDefaultValues = wrapperConfigDefaultValues;
        return this;
    }

    build() {
        if (this.wrapperConfigDefaultValues) {
            this.frameworkConfig.applyPromptsDefaultValues(this.wrapperConfigDefaultValues);
        }

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
