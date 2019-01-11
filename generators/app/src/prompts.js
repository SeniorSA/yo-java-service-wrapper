const fs = require('fs');
const { ServiceStartType } = require('./model');

const defaultServicePrompts = [
    {
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
            name: 'Automático (Atraso na inicialização)',
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
        message: 'Qual o JAR/WAR da aplicação (launcher do Spring Boot)? (Caminho relativo ao root do projeto)',
        validate: input => {
            const jarRealPath = fs.realpathSync(input);
            return new Promise((resolve, reject) => {
                fs.stat(jarRealPath, (err, stats) => {
                    if (err || !stats.isFile()) {
                        reject(`JAR/WAR não encontrado: ${jarRealPath}`)
                    } else {
                        resolve(true);
                    }
                });
            });
        }
    },
    ...defaultJvmPrompts
];

module.exports = {
    promptsSpringBoot
};

