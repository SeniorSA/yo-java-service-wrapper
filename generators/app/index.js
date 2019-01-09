const fs = require('fs');
const chalk = require('chalk');
const semver = require('semver');
const packagejs = require('../../package.json');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const wrapperConfigBuilder = require('./src/config-builder');
const { AppJavaFramework, ServiceStartType } = require('./src/config');
const { DefaultConfigReader, MavenConfigReader, NodeConfigReader } = require('./src/config-reader');

require.extensions['.njk'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8');
};

module.exports = class extends BaseGenerator {

    get initializing() {
        return {
            init(args) {
                // TODO
            },

            readConfig() {
                this.jhipsterAppConfig = this.getAllJhipsterConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Não foi possível ler o arquivo .yo-rc.json');
                }
            },

            displayLogo() {
                this.printSeniorFswLogo();

                this.log(`\nBem-vindo ao gerador ${chalk.bold.yellow('JHipster senior-fsw-wrapper')}! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            },

            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(`\nSeu projeto usava uma versão antiga do JHipster (${currentJhipsterVersion})... você precisa de pelo menos a versão (${minimumJhipsterVersion})\n`);
                }
            }
        };
    }

    prompting() {
        const prompts = [{
            type: 'list',
            name: 'javaFramework',
            message: 'Qual framework é usado no projeto?',
            choices: [{
                value: AppJavaFramework.SPRING_BOOT,
                name: 'Spring Boot'
            }, {
                value: AppJavaFramework.JSPARE,
                name: 'Vert.x + Jspare'
            }]
        }, {
            type: 'list',
            name: 'serviceStartType',
            message: 'Qual o tipo de inicialização do serviço?',
            default: ServiceStartType.AUTO_START,
            choices: [{
                value: ServiceStartType.AUTO_START,
                name: 'Automático'
            }, {
                value: ServiceStartType.DELAY_START,
                name: 'Automático (Atraso na inicialização)'
            }, {
                value: ServiceStartType.DEMAND_START,
                name: 'Manual'
            }]
        }];

        const done = this.async();
        this.prompt(prompts).then((props) => {
            this.props = props;
            done();
        });
    }

    writing() {
        this.log('writting...');
    }

    install() {
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

        this.log(`ProjectType: ${this.projectType}`);

        this.log('Lendo configurações do projeto.')
        configReader.read()
            .then(wrapperConfig => {
                const wrapperConfigFileContent = wrapperConfigBuilder.createWrapperConfigFile(wrapperConfig, this.props, jhipsterConstants);

                this.log('Criando diretório \'wrapper\'.');
                if (!fs.existsSync('wrapper')) {
                    fs.mkdirSync('wrapper');
                }

                fs.writeFileSync('wrapper/wrapper.cfg', wrapperConfigFileContent);

            }).catch(error => {
                this.log(`[ERROR] ${error.message}${error.error ? (' - Causa: ' + error.error) : ''}`);
                throw error;
            });
    }

    end() {
        this.log('End of senior-fsw-wrapper generator');
    }

    printSeniorFswLogo() {
        this.log('\n');
        this.log(`${chalk.green('  ██████╗  ████████╗  ███╗  ██╗  ████████╗  ████████╗  ███████╗            ')}${chalk.cyan('  ████████╗   ██████╗  ██╗    ██╗')}`);
        this.log(`${chalk.green(' ██╔════╝  ██╔═════╝  ██║█╗ ██║  ╚══██╔══╝  ██╔═══██║  ██╔═══██╗           ')}${chalk.cyan('  ██╔═════╝  ██╔════╝  ██║    ██║')}`);
        this.log(`${chalk.green(' ╚█████╗   ██████╗    ██║╚█╗██║     ██║     ██║   ██║  ███████╔╝   ██████╗ ')}${chalk.cyan('  ██████╗    ╚█████╗   ██║ ██╗██║')}`);
        this.log(`${chalk.green('  ╚═══██╗  ██╔═══╝    ██║ ╚███║     ██║     ██║   ██║  ██╔══██║    ╚═════╝ ')}${chalk.cyan('  ██╔═══╝     ╚═══██╗  ██║ ██║██║')}`);
        this.log(`${chalk.green(' ██████╔╝  ████████╗  ██║  ╚██║  ████████╗  ████████║  ██║  ╚██╗           ')}${chalk.cyan('  ██║        ██████╔╝  █████████║')}`);
        this.log(`${chalk.green(' ╚═════╝   ╚═══════╝  ╚═╝   ╚═╝  ╚═══════╝  ╚═══════╝  ╚═╝   ╚═╝           ')}${chalk.cyan('  ╚═╝        ╚═════╝   ╚════════╝')}`);
        this.log('\n');
        this.log(chalk.white.bold('                                             https://senior.com.br\n'));
        this.log(chalk.white('Welcome to Senior-FSW Wrapper Generator ') + chalk.yellow(`v${packagejs.version}`));
        this.log(chalk.white(`Os arquivos serão gerados no diretório: ${chalk.yellow(process.cwd())}`));

        if (process.cwd() === this.getUserHome()) {
            this.log(chalk.red.bold('\n️⚠️ ALERTA ⚠️  Você está em seu diretório HOME!'));
            this.log(chalk.red('Isso pode causar problemas, você sempre deve criar um novo diretório e executar o jhipster a partir deste.'));
            this.log(chalk.white(`Veja a seção de solução de problemas em ${chalk.yellow('https://www.jhipster.tech/installation/')}`));
        }

        this.log(chalk.green(' __________________________________________________________________________________________________________\n'));
        this.log(chalk.white(`  Documentação para configuração do wrapper em ${chalk.yellow('https://url.com.br')}`));
        this.log(chalk.green(' __________________________________________________________________________________________________________\n'));
    }

};
