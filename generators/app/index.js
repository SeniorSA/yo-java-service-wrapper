const fs = require('fs');
const ncp = require('ncp').ncp;
const chalk = require('chalk');
const { Framework } = require('./src/model');
const packagejs = require('../../package.json');
const getConfigFor = require('./src/framework-config');
const PromptBuilder = require('./src/prompt-builder');
const createWrapperConfigFile = require('./src/config-wrapper-generator');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const { DefaultConfigReader, MavenConfigReader, NodeConfigReader } = require('./src/config-reader');
// const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

require.extensions['.njk'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const FOLDER_WRAPPER = 'service-wrapper';
const SENIOR_FSW_WRAPPER_GENERATOR = 'Gerador de Wrapper (YAJSW) Senior-FSW';

module.exports = class extends BaseGenerator {

    get initializing() {
        return {
            init(args) {},

            readConfig() {
                this.jhipsterAppConfig = this.getAllJhipsterConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Não foi possível ler o arquivo .yo-rc.json');
                }
            },

            displayLogo() {
                this.printSeniorFswLogo();
            }
        };
    }

    prompting() {
        const promptsFramework = [{
            type: 'list',
            name: 'javaFramework',
            message: 'Qual é o framework usado no projeto?',
            choices: [{
                value: Framework.SPRING_BOOT,
                name: 'Spring Boot'
            }, {
                value: Framework.JSPARE,
                name: 'Vert.x + Jspare'
            }]
        }, {
            type: 'confirm',
            name: 'installService',
            message: 'Instalar o serviço nesse computador?',
            default: false
        }];

        const done = this.async();
        this.prompt(promptsFramework).then(setupProps => {
            this.frameworkConfig = getConfigFor(setupProps.javaFramework);

            this._readConfigurationFromProject().then(projectDefaults => {
                const prompts = new PromptBuilder(this.frameworkConfig)
                    .withDefaultValues(projectDefaults)
                    .build();

                this.prompt(prompts).then(props => {
                    this.appProps = Object.assign(setupProps, props);
                    done();
                });
            });
        });

    }

    writing() {
        this.log('Gerando o wrapper...');
    }

    install() {
        const done = this.async();
        new Promise((resolve, reject) => {
            const projectWrapperDir = fs.realpathSync(FOLDER_WRAPPER);
            const generatorWrapperDir = `${this.sourceRoot()}/yajsw`;

            this.log(chalk.grey('Copiando os arquivos do wrapper...'));
            ncp(generatorWrapperDir, projectWrapperDir, error => error ? reject(error) : resolve());

        }).then(() => {
            this.log(chalk.grey('Gerando configurações...\n'));
            const wrapperConfigFileContent = createWrapperConfigFile(this.frameworkConfig, this.appProps);
            fs.writeFileSync(`${FOLDER_WRAPPER}/conf/wrapper.conf`, wrapperConfigFileContent);

            this._installService();
            done();

        }).catch(error => {
            this.error(error);
            done();
            throw new Error('Falha ao copiar arquivos do wrapper.');
        });
    }

    _installService() {
        if (this.appProps.installService) {
            this.log(chalk.grey('TODO install the service'));
        }
    }

    end() {
        this.log(`Fim do ${SENIOR_FSW_WRAPPER_GENERATOR}.`);
    }

    _readConfigurationFromProject() {
        const pomXml = 'pom.xml';
        const packageJson = 'package.json';

        let configReader;
        if (fs.existsSync(pomXml)) {
            this.projectType = 'MAVEN';
            configReader = new MavenConfigReader(pomXml);

        } else if (fs.existsSync(packageJson)) {
            this.projectType = 'NODE';
            configReader = new NodeConfigReader(packageJson);

        } else {
            this.projectType = 'UNKNOWN';
            configReader = new DefaultConfigReader();
        }

        return configReader.read()
            .catch(error => {
                this.error(`${error.message}${error.error ? (' - Causa: ' + error.error) : ''}`);
                throw error;
            });
    }

    printSeniorFswLogo() {
        this.log('\n');
        this.log(`${chalk.green('  ██████╗  ████████╗  ███╗  ██╗  ████████╗  ████████╗  ███████╗            ')}${chalk.cyan('  ████████╗   ██████╗  ██╗    ██╗')}`);
        this.log(`${chalk.green(' ██╔════╝  ██╔═════╝  ██║█╗ ██║  ╚══██╔══╝  ██╔═══██║  ██╔═══██╗           ')}${chalk.cyan('  ██╔═════╝  ██╔════╝  ██║    ██║')}`);
        this.log(`${chalk.green(' ╚█████╗   ██████╗    ██║╚█╗██║     ██║     ██║   ██║  ███████╔╝   ██████╗ ')}${chalk.cyan('  ██████╗    ╚█████╗   ██║ ██╗██║')}`);
        this.log(`${chalk.green('  ╚═══██╗  ██╔═══╝    ██║ ╚███║     ██║     ██║   ██║  ██╔══██║    ╚═════╝ ')}${chalk.cyan('  ██╔═══╝     ╚═══██╗  ██║ ██║██║')}`);
        this.log(`${chalk.green(' ██████╔╝  ████████╗  ██║  ╚██║  ████████╗  ████████║  ██║  ╚██╗           ')}${chalk.cyan('  ██║        ██████╔╝  █████████║')}`);
        this.log(`${chalk.green(' ╚═════╝   ╚═══════╝  ╚═╝   ╚═╝  ╚═══════╝  ╚═══════╝  ╚═╝   ╚═╝           ')}${chalk.cyan('  ╚═╝        ╚═════╝   ╚════════╝')}`);
        this.log(chalk.white.bold('\n                                             https://senior.com.br\n'));

        if (process.cwd() === this.getUserHome()) {
            this.log(chalk.red.bold('\n️⚠️ ALERTA ⚠️  Você está em seu diretório HOME!'));
            this.log(chalk.red('Isso pode causar problemas, você sempre deve criar um novo diretório e executar o jhipster a partir deste.'));
            this.log(chalk.white(`Veja a seção de solução de problemas em ${chalk.yellow('https://www.jhipster.tech/installation/')}`));
        }

        this.log(chalk.green(' __________________________________________________________________________________________________________\n'));
        this.log(chalk.white(`  Bem-vindo ao ${SENIOR_FSW_WRAPPER_GENERATOR} ${chalk.yellow(`v${packagejs.version}`)}!`));
        this.log(chalk.white(`  Documentação para configuração do wrapper em ${chalk.yellow('https://url.com.br')}`));
        this.log(chalk.green(' __________________________________________________________________________________________________________\n'));

        const moduleWorkingDir = chalk.yellow(`${process.cwd().replace(/\\/g,'/')}/${FOLDER_WRAPPER}`);
        this.log(chalk.white(`Os arquivos serão gerados em: ${moduleWorkingDir}\n`));
    }

};
