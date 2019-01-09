# Especificações

- [ ] Criar pasta '<nome_projeto>-service' com arquivos do wrapper


# JHipster Generator

## USAGE
To begin to work:
- launch: npm install or yarn install
- link: npm link or yarn link
- test your module in a JHipster project:
    - go into your JHipster project
    - link to your module: npm link generator-jhipster-senior-fsw or yarn link generator-jhipster-senior-fsw
    - launch your module: yo jhipster-senior-fsw
- then, come back here, and begin to code!

## Example variables and execution

```
    Welcome to the JHipster senior-fsw generator! v0.0.0

    ? Please put something l

    --- some config read from config ---
    baseName=testmicroservice
    packageName=edu.jhipster.microservice
    clientFramework=undefined
    clientPackageManager=npm
    buildTool=maven

    --- some function ---
    angularAppName=testmicroserviceApp

    --- some const ---
    javaDir=src/main/java/edu/jhipster/microservice/
    resourceDir=src/main/resources/
    webappDir=src/main/webapp/

    --- variables from questions ---

    message=l
    ------

    create dummy-maven.txt


    I'm all done. Running npm install for you to install the required dependencies. If this fails, try running the command yourself.
```


### JHipster Constants:

```json
{
    "INTERPOLATE_REGEX": {},
    "DOCKER_DIR": "src/main/docker/",
    "LINE_LENGTH": 180,
    "LANGUAGES": [
        {
            "name": "Albanian",
            "dispName": "Shqip",
            "value": "al",
            "momentLocaleId": "sq"
        }
    ],
    "MAIN_DIR": "src/main/",
    "TEST_DIR": "src/test/",
    "CLIENT_MAIN_SRC_DIR": "src/main/webapp/",
    "CLIENT_TEST_SRC_DIR": "src/test/javascript/",
    "CLIENT_WEBPACK_DIR": "webpack/",
    "CLIENT_DIST_DIR": "www/",
    "ANGULAR_DIR": "src/main/webapp/app/",
    "REACT_DIR": "src/main/webapp/app/",
    "SERVER_MAIN_SRC_DIR": "src/main/java/",
    "SERVER_MAIN_RES_DIR": "src/main/resources/",
    "SERVER_TEST_SRC_DIR": "src/test/java/",
    "SERVER_TEST_RES_DIR": "src/test/resources/",
    "SUPPORTED_VALIDATION_RULES": [
        "required",
        "unique",
        "max",
        "min",
        "maxlength",
        "minlength",
        "maxbytes",
        "minbytes",
        "pattern"
    ],
    "JHIPSTER_DOCUMENTATION_URL": "https: //www.jhipster.tech",
    "JHIPSTER_DOCUMENTATION_ARCHIVE_PATH": "/documentation-archive/",
    "DOCKER_JHIPSTER_REGISTRY": "jhipster/jhipster-registry:v4.0.6",
    "DOCKER_JAVA_JRE": "openjdk:8-jre-alpine",
    "DOCKER_MYSQL": "mysql:5.7.20",
    "DOCKER_MARIADB": "mariadb:10.3.7",
    "DOCKER_POSTGRESQL": "postgres:10.4",
    "DOCKER_MONGODB": "mongo:4.0.2",
    "DOCKER_COUCHBASE": "couchbase/server:5.5.1",
    "DOCKER_CASSANDRA": "cassandra:3.9",
    "DOCKER_MSSQL": "microsoft/mssql-server-linux:latest",
    "DOCKER_ORACLE": "sath89/oracle-12c:latest",
    "DOCKER_HAZELCAST_MANAGEMENT_CENTER": "hazelcast/management-center:3.9.3",
    "DOCKER_MEMCACHED": "memcached:1.5.8-alpine",
    "DOCKER_ELASTICSEARCH": "elasticsearch:5.6.13",
    "DOCKER_KEYCLOAK": "jboss/keycloak:4.5.0.Final",
    "DOCKER_KAFKA": "wurstmeister/kafka:1.0.0",
    "DOCKER_ZOOKEEPER": "wurstmeister/zookeeper:3.4.6",
    "DOCKER_SONAR": "sonarqube:7.1",
    "DOCKER_JHIPSTER_CONSOLE": "jhipster/jhipster-console:v4.0.0",
    "DOCKER_JHIPSTER_CURATOR": "jhipster/jhipster-curator:v4.0.0",
    "DOCKER_JHIPSTER_ELASTICSEARCH": "jhipster/jhipster-elasticsearch:v4.0.0",
    "DOCKER_JHIPSTER_LOGSTASH": "jhipster/jhipster-logstash:v4.0.0",
    "DOCKER_JHIPSTER_IMPORT_DASHBOARDS": "jhipster/jhipster-import-dashboards:v4.0.0",
    "DOCKER_JHIPSTER_ZIPKIN": "jhipster/jhipster-zipkin:v4.0.0",
    "DOCKER_TRAEFIK": "traefik:1.7.4",
    "DOCKER_CONSUL": "consul:1.4.0",
    "DOCKER_CONSUL_CONFIG_LOADER": "jhipster/consul-config-loader:v0.3.0",
    "DOCKER_PROMETHEUS": "prom/prometheus:v2.4.3",
    "DOCKER_PROMETHEUS_ALERTMANAGER": "prom/alertmanager:v0.15.2",
    "DOCKER_GRAFANA": "grafana/grafana:5.3.0",
    "JAVA_VERSION": "1.8",
    "SCALA_VERSION": "2.12.6",
    "NODE_VERSION": "10.14.1",
    "YARN_VERSION": "1.12.3",
    "NPM_VERSION": "6.4.1",
    "DOCKER_JENKINS": "jenkins:latest",
    "DOCKER_SWAGGER_EDITOR": "swaggerapi/swagger-editor:latest",
    "SQL_DB_OPTIONS": [
        {
            "value": "mysql",
            "name": "MySQL"
        },
        {
            "value": "mariadb",
            "name": "MariaDB"
        },
        {
            "value": "postgresql",
            "name": "PostgreSQL"
        },
        {
            "value": "oracle",
            "name": "Oracle (Please follow our documentation to use the Oracle proprietary driver)"
        },
        {
            "value": "mssql",
            "name": "Microsoft SQL Server"
        }
    ],
    "DOCKER_COMPOSE_FORMAT_VERSION": "2",
    "DOCKER_PROMETHEUS_OPERATOR": "quay.io/coreos/prometheus-operator:v0.16.1",
    "DOCKER_GRAFANA_WATCHER": "quay.io/coreos/grafana-watcher:v0.0.8"
}
```
