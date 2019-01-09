class WrapperConfig {

    static get OPTIONALS() {
        return Object.freeze(['workingDir']);
    }

    constructor() {
        /** Nome de exibição do serviço quando executado via console, pode conter espaços. */
        this.consoleTitle = null;

        /** Nome do serviço, não pode conter ter espaços. Ex.: senior_app */
        this.serviceName = null;

        /** Nome de exibição do serviço, pode conter espaços. */
        this.serviceDisplayName = null;

        /** Descrição do serviço */
        this.serviceDescription = null;

        /** Modo de iniciação do serviço. Types: ServiceStartType. */
        this.serviceStartType = ServiceStartType.AUTO_START;

        /** Diretório de trabalho apontando para a pasta do aplicativo. */
        this.workingDir = null;

        this.java = new WrapperJavaConfig();
    }

}

class WrapperJavaConfig {

    static get OPTIONALS() {
        return Object.freeze(['encoding', 'parameters', 'classpaths']);
    }

    constructor() {
        /** Mínima versão requerida da JVM */
        this.minVersion = null;

        /**
         * [Opcional] Tipo de codificação dos arquivos, quando informado é utilizado como argumento -Dfile.encoding da JVM.
         * Padrão 'UTF-8'.
         */
        this.encoding = 'UTF-8';

        /** Classe principal da aplicação. */
        this.mainClass = null;

        /** Caminho para o jar da aplicação. Ex: ${app_dir}/integration/launcher/launcher.jar */
        this.jar = null;

        /**
         * Caminho para o java.exe embarcado.
         * Ex.: Ex:${app_dir}/jdk1.8.0_172/bin/java.exe
         * Ex.: %JAVA_HOME%/bin/java
         */
        this.command = null;

        /** [Opcional] Lista de parâmetros do Java. */
        this.parameters = [];

        /** [Opcional] Lista dos classpaths do Java. */
        this.classpaths = [];
    }

}

const ServiceStartType = Object.freeze({

    AUTO_START: 'AUTO_START',
    DELAY_START: 'DELAY_START',
    DEMAND_START: 'DEMAND_START',

});

const AppJavaFramework = Object.freeze({

    JSPARE: 'VERTX_JSPARE',
    SPRING_BOOT: 'SPRING_BOOT'

});

module.exports = {
    WrapperConfig,
    WrapperJavaConfig,
    ServiceStartType,
    AppJavaFramework
}
