const { Framework } = require('./model');
const { promptsSpringBoot } = require('./prompts');

class FrameworkConfig {

    constructor(framework, prompts) {
        this.framework = framework;
        this.prompts = prompts;
    }

    configure(wrapperConfig, answers) {
        wrapperConfig.consoleTitle = `senior-${wrapperConfig.consoleTitle}`;
        wrapperConfig.serviceName = `senior-${wrapperConfig.serviceName}`;
        wrapperConfig.serviceDisplayName = `Senior - ${wrapperConfig.serviceDisplayName}`;
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
