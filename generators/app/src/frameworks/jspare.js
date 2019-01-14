const { WrapperConfig } = require('./../models');
const FrameworkConfig = require('./framework-config');
const { PREFIX_ALTERNATIVE_QUESTION, SERVICE_PROMPTS, JVM_PROMPTS, Validators, Choices } = require('./prompts');

const prompts = [
    ...SERVICE_PROMPTS,
    {
        name: 'jarPath',
        required: true,
        message: 'Qual é o JAR/WAR contendo o Verticle?',
        paginated: true,
        choices: Choices.buildForRelativeFiles(['.jar', '.war'])
    }, {
        name: 'jarPathManual',
        required: true,
        message: 'Informe o caminho real do JAR/WAR (relativo ao sistema):',
        prefix: PREFIX_ALTERNATIVE_QUESTION,
        when: answers => answers.jarPath === Choices.ANSWER_MANUAL,
        validate: Validators.fileExists
    }, {
        name: 'verticleClass',
        required: true,
        message: 'Qual é a classe Verticle da aplicação?'
    }, {
        name: 'verticleConf',
        required: true,
        message: 'Qual é o arquivo de configuração do Verticle?',
        choices: Choices.buildForRelativeFiles(['.json'])
    }, {
        name: 'verticleConfManual',
        required: true,
        message: 'Informe o caminho real do arquivo de configuração (relativo ao sistema):',
        prefix: PREFIX_ALTERNATIVE_QUESTION,
        when: answers => answers.verticleConf === Choices.ANSWER_MANUAL,
        validate: Validators.fileExists
    }, {
        type: 'confirm',
        name: 'enableG5DnsResolver',
        required: true,
        message: 'O serviço irá executar em ambiente do cliente? (Quando não, desabilita o resolvedor de DNS para autenticação no G5).',
        default: true
    },
    ...JVM_PROMPTS
];

module.exports = class JspareConfig extends FrameworkConfig {

    constructor() {
        super(prompts);
    }

    defaults() {
        const defaults = new WrapperConfig();
        defaults.appMainClass = 'org.jspare.vertx.VertxJspareLauncher';
        return defaults;
    }

    configure(wrapperConfig, answers) {
        super.configure(wrapperConfig, answers);

        wrapperConfig.jarParameters = wrapperConfig.jarParameters.concat([
            'run',
            answers.verticleClass,
            '-conf',
            `"${answers.verticleConfManual || answers.verticleConf}"`,
            `-Dvertx.disableDnsResolver=${!answers.enableG5DnsResolver}`
        ]);
    }

}
