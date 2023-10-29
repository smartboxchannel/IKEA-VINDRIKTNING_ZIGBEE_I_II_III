// ############################################################################//
//                                                                             //
//    Файл с описанием  устройства IKEA_VINDRIKTNING_EFEKTA                    // 
//    для zigbee2mqtt брокера                                                  //
//                                                                             //
//    Необходимо перезагрузить z2m, что бы конвертер применился                //
//                                                                             //
//#############################################################################//

const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const constants = require('zigbee-herdsman-converters/lib/constants');
const e = exposes.presets;
const ea = exposes.access;

const tzLocal = {
	node_config: {
        key: ['reading_interval'],
        convertSet: async (entity, key, rawValue, meta) => {
			const endpoint = meta.device.getEndpoint(1);
            const lookup = {'OFF': 0x00, 'ON': 0x01};
            const value = lookup.hasOwnProperty(rawValue) ? lookup[rawValue] : parseInt(rawValue, 10);
            const payloads = {
                reading_interval: ['pm25Measurement', {0x0201: {value, type: 0x21}}],
            };
            await endpoint.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
	pm_gasstat_config: {
        key: ['high_pm25', 'low_pm25', 'enable_pm25', 'invert_logic_pm25'],
        convertSet: async (entity, key, rawValue, meta) => {
			const endpoint = meta.device.getEndpoint(1);
            const lookup = {'OFF': 0x00, 'ON': 0x01};
            const value = lookup.hasOwnProperty(rawValue) ? lookup[rawValue] : parseInt(rawValue, 10);
            const payloads = {
                high_pm25: ['pm25Measurement', {0x0221: {value, type: 0x21}}],
                low_pm25: ['pm25Measurement', {0x0222: {value, type: 0x21}}],
				enable_pm25: ['pm25Measurement', {0x0220: {value, type: 0x10}}],
				invert_logic_pm25: ['pm25Measurement', {0x0225: {value, type: 0x10}}],
            };
            await endpoint.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
	
};

const fzLocal = {
	node_config: {
        cluster: 'pm25Measurement',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0201)) {
                result.reading_interval = msg.data[0x0201];
            }
            return result;
        },
    },
	pm25: {
        cluster: 'pm25Measurement',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
			if (msg.data.hasOwnProperty('measuredValue')) {
				return {pm25: parseFloat(msg.data.measuredValue)};
			}
        },
    },
	pm1: {
        cluster: 'pm25Measurement',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
			if (msg.data.hasOwnProperty(0x00C8)) {
				return {pm1: parseFloat(msg.data[0x00C8])};
			}
        },
    },
    pm10: {
        cluster: 'pm25Measurement',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
			if (msg.data.hasOwnProperty(0x00C9)) {
				return {pm10: parseFloat(msg.data[0x00C9])};
			}
        },
    },
    pm_gasstat_config: {
        cluster: 'pm25Measurement',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0221)) {
                result.high_pm25 = msg.data[0x0221];
            }
			if (msg.data.hasOwnProperty(0x0222)) {
                result.low_pm25 = msg.data[0x0222];
            }
            if (msg.data.hasOwnProperty(0x0220)) {
                result.enable_pm25 = ['OFF', 'ON'][msg.data[0x0220]];
            }
			if (msg.data.hasOwnProperty(0x0225)) {
                result.invert_logic_pm25 = ['OFF', 'ON'][msg.data[0x0225]];
            }
            return result;
        },
    },	
};

const definition = {
        zigbeeModel: ['IKEA_VINDRIKTNING_EFEKTA'],
        model: 'IKEA_VINDRIKTNING_EFEKTA',
        vendor: 'IKEA',
        description: '[IKEA_VINDRIKTNING - Solid particle sensor with extended functionality (control of air cleaning)](http://efektalab.com/IKEA_VINDRIKTNING )',
        fromZigbee: [fzLocal.pm25, fzLocal.pm1, fzLocal.pm10, fzLocal.pm_gasstat_config, fzLocal.node_config],
        toZigbee: [tz.factory_reset,  tzLocal.pm_gasstat_config, tzLocal.node_config],
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
            const clusters = ['pm25Measurement'];
			await reporting.bind(endpoint, coordinatorEndpoint, clusters);
			const payload1 = [{attribute: {ID: 0x0000, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 600, reportableChange: 0}];
            await endpoint.configureReporting('pm25Measurement', payload1);
			const payload2 = [{attribute: {ID: 0x00C8, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 600, reportableChange: 0}];
            await endpoint.configureReporting('pm25Measurement', payload2);
			const payload3 = [{attribute: {ID: 0x00C9, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 600, reportableChange: 0}];
			await endpoint.configureReporting('pm25Measurement', payload3);
        },
        exposes: [exposes.numeric('pm25', ea.STATE).withUnit('μg/m³').withDescription('PM2.5'),
		    exposes.numeric('pm1', ea.STATE).withUnit('μg/m³').withDescription('PM1.0'),
			exposes.numeric('pm10', ea.STATE).withUnit('μg/m³').withDescription('PM10'),
		    exposes.numeric('reading_interval', ea.STATE_SET).withUnit('Seconds').withDescription('Setting the sensor reading interval Setting the time in seconnds, by default 30 seconds')
                .withValueMin(15).withValueMax(300),
			exposes.binary('enable_pm25', ea.STATE_SET, 'ON', 'OFF').withDescription('Enable PM2.5 Control'),
			exposes.binary('invert_logic_pm25', ea.STATE_SET, 'ON', 'OFF').withDescription('Enable invert logic PM2.5 Control'),
            exposes.numeric('high_pm25', ea.STATE_SET).withUnit('ppm').withDescription('Setting High PM2.5 Border')
                .withValueMin(0).withValueMax(1000),
            exposes.numeric('low_pm25', ea.STATE_SET).withUnit('ppm').withDescription('Setting Low PM2.5 Border')
                .withValueMin(0).withValueMax(1000)],
};

module.exports = definition;