const FrameworkConfig = require('./framework-config');
const {
    PREFIX_ALTERNATIVE_QUESTION,
    SERVICE_PROMPTS,
    JVM_PROMPTS,
    Validators,
    Choices
} = require('./prompts');

const prompts = [
    ...SERVICE_PROMPTS,
    {
        name: 'jarPath',
        required: true,
        message: 'Qual é o JAR/WAR da aplicação (launcher do Spring Boot)?',
        paginated: true,
        choices: Choices.buildForRelativeFiles(['.jar', '.war'])
    }, {
        name: 'jarPathManual',
        required: true,
        message: 'Informe o caminho real do JAR/WAR (relativo ao sistema):',
        prefix: PREFIX_ALTERNATIVE_QUESTION,
        when: answers => answers.jarPath === Choices.ANSWER_MANUAL,
        validate: Validators.fileExists
    },
    ...JVM_PROMPTS
];

module.exports = class SpringBootConfig extends FrameworkConfig {
    constructor() {
        super(prompts);
    }
};
