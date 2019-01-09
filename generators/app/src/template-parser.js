const fs = require('fs');
const nunjucks = require('nunjucks');

function parseWrapperConfig(config) {
    if (!config) {
        throw new Error('A configuração do Wrapper não pode ser nula.');
    }

    // TODO desabilitada validação temporariamente.
    // validateConfig(config);

    const rawTemplate = require('../templates/wrapper.njk');
    const template = nunjucks.compile(rawTemplate);

    return template.render({ config });
}

function validateConfig(config, fieldPath = 'wrapperConfig.') {
    for (const field in config) {
        const fieldValue = config[field];

        if (Array.isArray(fieldValue)) {
            continue;

        } else if (!fieldValue && isRequired(config, field)) {
            throw new Error(`A configuração ${fieldPath}${field} não foi encontrada/informada.`);

        } else if (fieldValue !== null && typeof fieldValue === 'object') {
            validateConfig(fieldValue, `${fieldPath}${field}.`);
        }
    };
}

function isRequired(object, field) {
    return typeof object.constructor.OPTIONALS === 'undefined' || object.constructor.OPTIONALS.indexOf(field) === -1;
}

module.exports = {
    parseWrapperConfig
}
