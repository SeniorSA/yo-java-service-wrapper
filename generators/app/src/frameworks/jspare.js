const ncp = require('ncp').ncp;
const FrameworkConfig = require('./framework-config');
const { WrapperConfig, Constants } = require('./../models');
const discoverFilesByExtension = require('../utils/file-utils').discoverFilesByExtension;
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
        message: 'Qual é a classe Verticle da aplicação?',
        choices: answers => {
            const jarPath = (answers.jarPathManual || answers.jarPath).replace(/\\/g, '/');
            const targetPath = jarPath.substring(0, jarPath.lastIndexOf('/'));
            const classesPath = `${targetPath}/classes/`;

            return discoverFilesByExtension(classesPath, ['.class'])
                .filter(filePath => /Verticle/.test(filePath))
                .map(filePath => {
                    const classReference = filePath.match(/(?:classes[\/\\])(.*)\.class/)[1].replace(/[\/\\]/g, '.')
                    return { name: classReference, value: classReference }
                }).concat({
                    name: 'Outro: informar manualmente',
                    value: Choices.ANSWER_MANUAL
                });
        }
    }, {
        name: 'verticleClassManual',
        required: true,
        message: 'Informe a classe Verticle da aplicação (ex.: br.com.senior.AppVerticle):',
        when: answers => answers.verticleClass === Choices.ANSWER_MANUAL,
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
        name: 'webDistFolder',
        required: false,
        message: 'Informe o diretório contendo os arquivos de distribuição do Front-end da aplicação (relativo ao sistema):',
        validate: input => {
            if (input === '/') {
                return 'Você tem certeza que este diretório está correto?';
            } else if (input !== '') {
                return Validators.directoryExists(input);
            }
            return true;
        }
    }, {
        name: 'enableG5DnsResolver',
        type: 'confirm',
        required: true,
        message: 'O serviço irá executar em ambiente do cliente? (Quando não, desabilita o resolvedor de DNS para autenticação no G5).',
        default: true
    },
    ...JVM_PROMPTS
];

module.exports = class JspareConfig extends FrameworkConfig {

    static get CONFIG_FILE() {
        return 'jspare-conf.json';
    }

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
            answers.verticleClassManual || answers.verticleClass,
            '-conf',
            `"${Constants.FOLDER_CONFIGURATIONS}/${JspareConfig.CONFIG_FILE}"`,
            `-Dvertx.disableDnsResolver=${!answers.enableG5DnsResolver}`
        ]);
    }

    install(wrapperConfig, answers) {
        const promiseWebRoot = new Promise((resolve, reject) => {
            if (answers.webDistFolder) {
                const projectWebRootDir = `${Constants.FOLDER_WRAPPER}/${Constants.FOLDER_WEBROOT}`;
                ncp(answers.webDistFolder, projectWebRootDir, error => error ? reject(error) : resolve());
            } else {
                resolve();
            }
        });

        const promiseConfig = new Promise((resolve, reject) => {
            const jspareConfigFileDir = answers.verticleConfManual || answers.verticleConf;
            const projectJspareConfigFileDir = `${Constants.FOLDER_WRAPPER}/${Constants.FOLDER_CONFIGURATIONS}/${JspareConfig.CONFIG_FILE}`;
            ncp(jspareConfigFileDir, projectJspareConfigFileDir, error => error ? reject(error) : resolve());
        });

        return Promise.all([promiseWebRoot, promiseConfig]);
    }

}
