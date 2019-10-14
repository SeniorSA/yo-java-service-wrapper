const fs = require('fs');
const chalk = require('chalk');
const { ServiceStartType } = require('../models');
const discoverRelativeFilesByExtension = require('../utils/file-utils').discoverRelativeFilesByExtension;

const PREFIX_ALTERNATIVE_QUESTION = chalk.green('  \\- ');

const Validators = {

    directoryExists: input => {
        return new Promise((resolve, reject) => {
            fs.stat(input, (err, stats) => {
                if (err || !stats.isDirectory()) {
                    reject(`Diretório não encontrado: ${input}`)
                } else {
                    resolve(true);
                }
            });
        });
    },

    fileExists: input => {
        return new Promise((resolve, reject) => {
            fs.stat(input, (err, stats) => {
                if (err || !stats.isFile()) {
                    reject(`Arquivo não encontrado: ${input}`)
                } else {
                    resolve(true);
                }
            });
        });
    }

}

const Choices = {

    ANSWER_MANUAL: '_manual_',

    buildForRelativeFiles(fileExtensions) {
        return () => {
            const rootPath = fs.realpathSync('');
            return discoverRelativeFilesByExtension('', fileExtensions)
                .map(filePath => {
                    return {
                        name: filePath.replace(rootPath, ''),
                        value: filePath
                    }
                }).concat({
                    name: 'Outro: informar manualmente',
                    value: Choices.ANSWER_MANUAL
                });
        }
    }

}

const SERVICE_PROMPTS = [
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
        default: ServiceStartType.DELAY_START,
        message: 'Qual é o tipo de inicialização do serviço?',
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
    }
];

const JVM_PROMPTS = [
    {
        name: 'appMainClass',
        required: false,
        message: 'Qual é a classe principal da aplicação? (Deixe em branco para utilizar a classe principal do jar)',
    }, {
        name: 'javaHome',
        required: false,
        message: 'Informe o diretório para o Java HOME (JDK/JRE)? (Deixe em branco para utilizar o padrão do sistema)',
    }, {
        name: 'jvmEncoding',
        required: false,
        message: 'Qual é o encoding da JVM?',
        default: 'UTF-8'
    },
];

module.exports = {

    Choices,
    Validators,
    JVM_PROMPTS,
    SERVICE_PROMPTS,
    PREFIX_ALTERNATIVE_QUESTION

};

