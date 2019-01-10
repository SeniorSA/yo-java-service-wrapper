const nunjucks = require('nunjucks');
const { WrapperConfig } = require('./model');

function createWrapperConfigFile(frameworkConfig, answers) {
    const config = createConfigFromAnswers(answers);

    frameworkConfig.configure(config, answers);

    if (config.jvmEncoding) {
        config.jvmArguments.push(`-Dfile.encoding=${config.jvmEncoding}`);
    }

    validateConfig(config, frameworkConfig.prompts);

    return parseWrapperConfig(config);
}

function createConfigFromAnswers(answers) {
    const config = new WrapperConfig();

    for (const answerName in answers) {
        if (typeof config[answerName] !== 'undefined') {
            config[answerName] = answers[answerName];
        }
    }

    return config;
}

function parseWrapperConfig(config) {
    if (!config) {
        throw new Error('A configuração do Wrapper não pode ser nula.');
    }

    const rawTemplate = require('../templates/wrapper.njk');
    const template = nunjucks.compile(rawTemplate);

    return template.render({ config });
}

function validateConfig(config, prompts) {
    for (const field in config) {
        const prompt = prompts.find(p => p.name === field);
        if (!prompt) {
            continue;
        }

        const fieldValue = config[field];

        if (!fieldValue && prompt.required) {
            throw new Error(`A configuração ${field} não foi encontrada/informada.`);
        }
    };
}

module.exports = createWrapperConfigFile;
