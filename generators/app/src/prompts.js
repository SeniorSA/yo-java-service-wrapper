const fs = require('fs');
const chalk = require('chalk');
const { ServiceStartType } = require('./model');
const discoverFilesByExtension = require('./file-utils').discoverFilesByExtension;

const PREFIX_ALTERNATIVE_QUESTION = chalk.green('  \\- ');

const defaultServicePrompts = [
    {
        name: 'installService',
        type: 'confirm',
        message: 'Instalar o serviço nesse computador?',
        default: false
    }, {
        name: 'serviceName',
        required: true,
        message: 'Qual é o nome do serviço? (Não pode conter espaços, ex.: senior_app)',
        validate: input => {
            if (!input) {
                return false;
            }

            const name = input.trim();
            if (/\s/.test(name)) {
                return 'Não pode conter espaços!';
            }

            if (!/^[\w-]+$/.test(name)) {
                return 'Nome inválido: não pode conter espaços e caracteres especiais. (permitido: [A-Za-z0-9-_])';
            }

            return true;
        }
    }, {
        name: 'serviceDisplayName',
        required: true,
        message: 'Qual é o nome de exibição do serviço? (Pode conter espaços)'
    }, {
        name: 'serviceDescription',
        required: false,
        message: 'Qual é a descrição do serviço?'
    }, {
        name: 'serviceStartType',
        required: true,
        default: ServiceStartType.AUTO_START,
        message: 'Qual o tipo de inicialização do serviço?',
        choices: [{
            name: 'Automático',
            value: ServiceStartType.AUTO_START
        }, {
            name: 'Automático (Com atraso na inicialização)',
            value: ServiceStartType.DELAY_START
        }, {
            name: 'Manual',
            value: ServiceStartType.DEMAND_START
        }]
    }, {
        name: 'workingDir',
        required: false,
        message: 'Qual o diretório de trabalho do aplicativo? (Caminho relativo ao root do projeto)',
        default: '${wrapper_home}'
    }
];

const defaultJvmPrompts = [
    {
        name: 'wrapperMainClass',
        required: true,
        default: 'org.rzo.yajsw.app.WrapperJVMMain',
        message: 'Qual a classe executada quando o wrapper inicia a aplicação?',
        choices: [{
            name: 'YAJSW WrapperMain',
            value: 'org.rzo.yajsw.app.WrapperJVMMain'
        }, {
            name: 'Tanuki Software WrapperJarApp (não exige classe principal da aplicação)',
            value: 'org.tanukisoftware.wrapper.WrapperJarApp'
        }]
    }, {
        name: 'appMainClass',
        required: false,
        message: 'Qual a classe principal da aplicação? (Deixe em branco para utilizar a classe principal do jar)',
    }, {
        name: 'jvmEncoding',
        required: false,
        message: 'Qual é o encoding da JVM?',
        default: 'UTF-8'
    },
];

const promptsSpringBoot = [
    ...defaultServicePrompts,
    {
        name: 'jarPath',
        required: true,
        message: 'Qual o JAR/WAR da aplicação (launcher do Spring Boot)?',
        paginated: true,
        choices: () => {
            const rootPath = fs.realpathSync('');
            const pathChoices = discoverFilesByExtension('', ['.jar', '.war'])
                .map(filePath => {
                    return { name: filePath.replace(rootPath, ''), value: filePath }
                });
            pathChoices.push({
                name: 'Outro: informar manualmente',
                value: 'manual'
            });
            return pathChoices;
        }
    }, {
        name: 'jarPathManual',
        required: true,
        message: 'Informe o caminho real do JAR/WAR (relativo ao sistema):',
        prefix: PREFIX_ALTERNATIVE_QUESTION,
        when: answers => answers.jarPath === 'manual',
        validate: input => new Promise((resolve, reject) => {
            fs.stat(input, (err, stats) => {
                if (err || !stats.isFile()) {
                    reject(`JAR/WAR não encontrado: ${input}`)
                } else {
                    resolve(true);
                }
            });
        })
    },
    ...defaultJvmPrompts
];

module.exports = {
    promptsSpringBoot
};

