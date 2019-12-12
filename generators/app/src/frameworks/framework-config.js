const escapeUnicode = require('escape-unicode');
const { Constants, WrapperConfig } = require('../models');

const REGEX_SPECIAL_CHARACTERS = /[^\w\s-]/g;

module.exports = class FrameworkConfig {
    constructor(prompts) {
        this.prompts = prompts;
    }

    defaults() {
        return new WrapperConfig();
    }

    configure(wrapperConfig, answers) {
        wrapperConfig.workingDir = '${wrapper_home}'; // eslint-disable-line no-template-curly-in-string
        wrapperConfig.serviceName = `senior-${wrapperConfig.serviceName}`;
        wrapperConfig.serviceDisplayName = this._escapeUnicode(`Senior - ${wrapperConfig.serviceDisplayName}`);
        wrapperConfig.serviceDescription = this._escapeUnicode(wrapperConfig.serviceDescription);
        wrapperConfig.jar = Constants.APP_JAR_NAME;
        wrapperConfig.jarPath = answers.jarPathManual || answers.jarPath;

        if (wrapperConfig.jvmEncoding) {
            wrapperConfig.jvmArguments.push(`-Dfile.encoding=${wrapperConfig.jvmEncoding}`);
        }
    }

    _escapeUnicode(text) {
        return text.replace(REGEX_SPECIAL_CHARACTERS, specialCharacter => escapeUnicode(specialCharacter));
    }

    applyPromptsDefaultValues(wrapperConfig) {
        Object.keys(wrapperConfig).forEach((currentCfg) => {
            const cfgProp = this.prompts.find(prompt => prompt.name === currentCfg);

            if (cfgProp && wrapperConfig[currentCfg]) {
                cfgProp.default = wrapperConfig[currentCfg];
            }
        });
    }

    install(wrapperConfig, answers) {
        return Promise.resolve();
    }
};
