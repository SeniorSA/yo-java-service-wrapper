const nunjucks = require('nunjucks');
const { WrapperConfig } = require('./models');

function createWrapperConfig(frameworkConfig, answers) {
    const config = createConfigFromAnswers(answers);
    frameworkConfig.configure(config, answers);

    validateConfig(config, frameworkConfig.prompts);

    config.fileContent = parseWrapperConfig(config);
    return config;
}

function createConfigFromAnswers(answers) {
    const config = new WrapperConfig();
    config.workingDir = '';

    Object.keys(answers).forEach((answerName) => {
        if (typeof config[answerName] !== 'undefined') {
            config[answerName] = answers[answerName];
        }
    });

    return config;
}

function parseWrapperConfig(config) {
    if (!config) {
        throw new Error('A configuração do Wrapper não pode ser nula.');
    }

    const rawTemplate = require('../templates/wrapper.conf.njk'); // eslint-disable-line global-require
    const template = nunjucks.compile(rawTemplate);
    return template.render({ config });
}

function validateConfig(config, prompts) {
    Object.keys(config).forEach((configField) => {
        const prompt = prompts.find(p => p.name === configField);
        if (prompt) {
            const fieldValue = config[configField];

            if (!fieldValue && prompt.required) {
                throw new Error(`A configuração ${configField} não foi encontrada/informada.`);
            }
        }
    });
}

module.exports = createWrapperConfig;
