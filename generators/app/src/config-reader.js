const fs = require('fs');
const xml2js = require('xml2js');
const { WrapperConfig } = require('./config');

class DefaultConfigReader {

    constructor() { }

    read() {
        return Promise.resolve(new WrapperConfig());
    }

}

class MavenConfigReader extends DefaultConfigReader {

    constructor(pomFileDir) {
        super();
        this._pomFileDir = pomFileDir;
    }

    read() {
        return new Promise((resolve, reject) => {
            super.read().then(config => {
                const pomXmlContent = fs.readFileSync(this._pomFileDir);
                xml2js.parseString(pomXmlContent, (error, result) => {
                    if (error) {
                        reject({
                            message: '[MavenConfigReader] Falha ao ler configurações do pom.xml.',
                            error: error
                        });
                    }

                    const pom = result.project;
                    this._extractInfoFromPom(config, pom)

                    resolve(config);
                });
            });
        });
    }

    _extractInfoFromPom(config, pom) {
        config.consoleTitle = pom.name;
        config.serviceName = pom.artifactId;
        config.serviceDisplayName = pom.name;
        config.serviceDescription = pom.description || pom.name;
        config.java.minVersion = this._extractJavaVersion(pom);
    }

    _extractJavaVersion(pom) {
        const propJavaVersion = pom.properties && pom.properties[0]['java.version'];
        if (propJavaVersion) {
            return propJavaVersion[0];
        }

        const compilerPlugin = pom.build[0].plugins[0].plugin.find(plugin => plugin.artifactId[0] === 'maven-compiler-plugin');
        if (compilerPlugin && compilerPlugin.configuration) {
            return compilerPlugin.configuration.target;
        }

        return '';
    }

}

class NodeConfigReader extends DefaultConfigReader {

    constructor(packageJsonFileDir) {
        super();
        this._packageJsonFileDir = packageJsonFileDir;
    }

    read() {
        // TODO
        throw new Error('[NodeConfigReader] Ainda não implementado.');
    }

}

module.exports = {
    DefaultConfigReader,
    MavenConfigReader,
    NodeConfigReader
}
