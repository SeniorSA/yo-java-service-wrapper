const escapeUnicode = require('escape-unicode');
const { promptsSpringBoot } = require('./prompts');
const { Framework, Constants } = require('./model');

const REGEX_SPECIAL_CHARACTERS = /[^\w\s-]/g;

class FrameworkConfig {

    constructor(framework, prompts) {
        this.framework = framework;
        this.prompts = prompts;
    }

    configure(wrapperConfig, answers) {
        wrapperConfig.serviceName = `senior-${wrapperConfig.serviceName}`;
        wrapperConfig.serviceDisplayName = this._escapeUnicode(`Senior - ${wrapperConfig.serviceDisplayName}`);
        wrapperConfig.serviceDescription = this._escapeUnicode(wrapperConfig.serviceDescription);
        wrapperConfig.jar = Constants.APP_JAR_NAME;
    }

    _escapeUnicode(text) {
        return text.replace(REGEX_SPECIAL_CHARACTERS, specialCharacter => escapeUnicode(specialCharacter));
    }

    applyPromptsDefaultValues(config) {
        for (const currentCfg in config) {
            const cfgProp = this.prompts.find(prompt => prompt.name === currentCfg);

            if (cfgProp && config[currentCfg]) {
                cfgProp.default = config[currentCfg];
            }
        }
    }

}

class SpringBootConfig extends FrameworkConfig {

    constructor() {
        super(Framework.SPRING_BOOT, promptsSpringBoot)
    }

    configure(wrapperConfig, answers) {
        if (answers.jarPathManual) {
            wrapperConfig.jarPath = answers.jarPathManual;
        } else {
            wrapperConfig.jarPath = answers.jarPath;
        }
    }

}

class JspareConfig extends FrameworkConfig {

    constructor() {
        super(Framework.JSPARE, [])
    }

    configure(wrapperConfig, answers) {
        super.configure(wrapperConfig, answers);
        // # wrapper.app.parameter.1 = ../lib/volkswagen-api.jar
        // # wrapper.app.parameter.2 = run
        // # wrapper.app.parameter.3 = br.com.senior.volkswagen.ApiVerticle
        // # wrapper.app.parameter.4 = -conf
        // # wrapper.app.parameter.5 = "../conf/conf.json"
        // # wrapper.app.parameter.6 = -Dvertx.disableDnsResolver=true
    }

}

const configs = {
    [Framework.SPRING_BOOT]: () => new SpringBootConfig()
}

module.exports = function getConfigFor(framework) {
    const frameworkConfig = configs[framework];

    if (frameworkConfig) {
        return frameworkConfig();
    } else {
        throw new Error(`Framework ${framework} (ainda) não suportado.`);
    }
}
