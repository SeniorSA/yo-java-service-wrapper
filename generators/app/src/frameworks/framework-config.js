const { Constants, WrapperConfig } = require('../models');
const escapeUnicode = require('escape-unicode');

const REGEX_SPECIAL_CHARACTERS = /[^\w\s-]/g;

module.exports = class FrameworkConfig {

    constructor(prompts) {
        this.prompts = prompts;
    }

    defaults() {
        return new WrapperConfig();
    }

    configure(wrapperConfig, answers) {
        wrapperConfig.workingDir = '${wrapper_home}';
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
        for (const currentCfg in wrapperConfig) {
            const cfgProp = this.prompts.find(prompt => prompt.name === currentCfg);

            if (cfgProp && wrapperConfig[currentCfg]) {
                cfgProp.default = wrapperConfig[currentCfg];
            }
        }
    }

    install(wrapperConfig, answers) {
        return Promise.resolve();
    }

}
