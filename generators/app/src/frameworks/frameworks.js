const { Framework } = require('../models');
const JspareConfig = require('./jspare');
const SpringBootConfig = require('./spring-boot');

const KNOWN_FRAMEWORKS = {
    [Framework.JSPARE]: () => new JspareConfig(),
    [Framework.SPRING_BOOT]: () => new SpringBootConfig()
};

module.exports = {

    getConfig: (framework) => {
        const frameworkConfig = KNOWN_FRAMEWORKS[framework];

        if (frameworkConfig) {
            return frameworkConfig();
        }

        throw new Error(`Framework ${framework} (ainda) não suportado.`);
    }

};
