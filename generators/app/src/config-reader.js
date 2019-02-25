const fs = require('fs');
const xml2js = require('xml2js');
const { WrapperConfig } = require('./models');

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
        config.consoleTitle = this._extracText(pom.name);
        config.serviceName = this._extracText(pom.artifactId);
        config.serviceDisplayName = this._extracText(pom.name);
        config.serviceDescription = this._extracText(pom.description);
        config.javaMinVersion = this._extractJavaVersion(pom);
    }

    _extractJavaVersion(pom) {
        const propJavaVersion = pom.properties && pom.properties[0]['java.version'];
        if (propJavaVersion) {
            return this._extracText(propJavaVersion);
        }

        const compilerPlugin = this._findPlugin(pom, 'maven-compiler-plugin');
        if (compilerPlugin && compilerPlugin.configuration) {
            return compilerPlugin.configuration.target;
        }

        return '';
    }

    _findPlugin(pom, pluginArtifactId) {
        return pom.build[0].plugins[0].plugin.find(plugin => plugin.artifactId[0] === pluginArtifactId);
    }

    _extracText(tag) {
        if (tag) {
            const content = tag[0];
            if (content) {
                return String(content).trim();
            }
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

class wrapperConfigReader extends DefaultConfigReader {

}

module.exports = {
    DefaultConfigReader,
    MavenConfigReader,
    NodeConfigReader
}
