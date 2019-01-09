const wrapperConfigParser = require('./template-parser');

function createWrapperConfigFile(config, props) {

    config.serviceStartType = props.serviceStartType;
    config.java.parameters = ['-Dfdsf=432', 'sdfishd'];
    config.java.classpaths = ['../lib'];

    return wrapperConfigParser.parseWrapperConfig(config);
}

module.exports = {
    createWrapperConfigFile
}
