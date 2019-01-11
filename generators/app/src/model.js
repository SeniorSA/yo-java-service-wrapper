class WrapperConfig {

    constructor() {
        /** Nome de exibição do serviço quando executado via console, pode conter espaços. */
        this.consoleTitle = null;

        /** Nome do serviço, não pode conter ter espaços. Ex.: senior_app */
        this.serviceName = null;

        /** Nome de exibição do serviço, pode conter espaços. */
        this.serviceDisplayName = null;

        /** Descrição do serviço. */
        this.serviceDescription = null;

        /** Modo de iniciação do serviço. Types: ServiceStartType. */
        this.serviceStartType = ServiceStartType.AUTO_START;

        /** Diretório de trabalho apontando para a pasta do aplicativo. */
        this.workingDir = null;

        /** Mínima versão requerida da JVM */
        this.javaMinVersion = null;

        /**
         * Tipo de codificação dos arquivos, quando informado é utilizado como argumento -Dfile.encoding da JVM.
         */
        this.jvmEncoding = 'UTF-8';

        /** Classe principal do wrapper. */
        this.wrapperMainClass = null;

        /** Classe principal da aplicação. */
        this.appMainClass = null;

        /** Caminho para o jar da aplicação. Ex: ${app_dir}/integration/launcher/launcher.jar */
        this.jar = null;

        /** [Opcional] Lista de argumentos do jar. */
        this.jarParameters = [];

        /**
         * Caminho para o java.exe embarcado.
         * Ex.: Ex:${app_dir}/jdk1.8.0_172/bin/java.exe
         * Ex.: %JAVA_HOME%/bin/java
         */
        this.javaCommand = null;

        /** [Opcional] Lista dos classpaths do Java. */
        this.classpaths = [];

        /** [Opcional] Lista de parâmetros adicionais da JVM. */
        this.jvmArguments = [];
    }

}

const ServiceStartType = Object.freeze({

    AUTO_START: 'AUTO_START',
    DELAY_START: 'DELAY_START',
    DEMAND_START: 'DEMAND_START',

});

const Framework = Object.freeze({

    JSPARE: 'VERTX_JSPARE',
    SPRING_BOOT: 'SPRING_BOOT'

});

const Constants = Object.freeze({

    APP_JAR_NAME: 'app.jar'

});

module.exports = {
    WrapperConfig,
    ServiceStartType,
    Framework,
    Constants
}
