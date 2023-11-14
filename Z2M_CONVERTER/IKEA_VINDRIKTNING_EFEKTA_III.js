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
const {calibrateAndPrecisionRoundOptions} = require('zigbee-herdsman-converters/lib/utils');
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
	co2_config: {
        key: ['forced_recalibration', 'factory_reset_co2', 'set_altitude', 'automatic_scal'],
        convertSet: async (entity, key, rawValue, meta) => {
			const endpoint = meta.device.getEndpoint(1);
            const lookup = {'OFF': 0x00, 'ON': 0x01};
            const value = lookup.hasOwnProperty(rawValue) ? lookup[rawValue] : parseInt(rawValue, 10);
            const payloads = {
                forced_recalibration: ['msCO2', {0x0202: {value, type: 0x10}}],
				automatic_scal: ['msCO2', {0x0402: {value, type: 0x10}}],
                factory_reset_co2: ['msCO2', {0x0206: {value, type: 0x10}}],
                set_altitude: ['msCO2', {0x0205: {value, type: 0x21}}],
            };
            await endpoint.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
	temperaturef_config: {
        key: ['temperature_offset'],
        convertSet: async (entity, key, rawValue, meta) => {
			const endpoint = meta.device.getEndpoint(2);
            const value = parseFloat(rawValue)*10;
            const payloads = {
                temperature_offset: ['msTemperatureMeasurement', {0x0210: {value, type: 0x29}}],
            };
            await endpoint.write(payloads[key][0], payloads[key][1]);
            return {
                state: {[key]: rawValue},
            };
        },
    },
	humidity_config: {
        key: ['humidity_offset'],
        convertSet: async (entity, key, rawValue, meta) => {
			const endpoint = meta.device.getEndpoint(2);
            const value = parseInt(rawValue, 10)
            const payloads = {
                humidity_offset: ['msRelativeHumidity', {0x0210: {value, type: 0x29}}],
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
	co2: {
        cluster: 'msCO2',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
			if (msg.data.hasOwnProperty('measuredValue')) {
				return {co2: Math.round(msg.data.measuredValue * 1000000)};
			}
        },
    },
	co2_config: {
        cluster: 'msCO2',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
			if (msg.data.hasOwnProperty(0x0402)) {
                result.automatic_scal = ['OFF', 'ON'][msg.data[0x0402]];
            }
            if (msg.data.hasOwnProperty(0x0202)) {
                result.forced_recalibration = ['OFF', 'ON'][msg.data[0x0202]];
            }
            if (msg.data.hasOwnProperty(0x0206)) {
                result.factory_reset_co2 = ['OFF', 'ON'][msg.data[0x0206]];
            }
            if (msg.data.hasOwnProperty(0x0205)) {
                result.set_altitude = msg.data[0x0205];
            }
            return result;
        },
    },
	temperaturef_config: {
        cluster: 'msTemperatureMeasurement',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0210)) {
                result.temperature_offset = parseFloat(msg.data[0x0210])/10.0;
            }
            return result;
        },
    },
    humidity_config: {
        cluster: 'msRelativeHumidity',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
            const result = {};
            if (msg.data.hasOwnProperty(0x0210)) {
                result.humidity_offset = msg.data[0x0210];
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
	air_quality: {
        cluster: 'genAnalogInput',
        type: ['attributeReport', 'readResponse'],
        convert: (model, msg, publish, options, meta) => {
			const result = {};
            if (msg.data.hasOwnProperty(0x0065)) {
                result.voc_raw_data = parseFloat(msg.data[0x0065]);
            }
			if (msg.data.hasOwnProperty('presentValue')) {
			    result.voc_index = msg.data.presentValue;
			}
			return result;
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
        zigbeeModel: ['IKEA_VINDRIKTNING_EFEKTA III'],
        model: 'IKEA_VINDRIKTNING_EFEKTA III',
        vendor: 'IKEA',
        description: '[IKEA_VINDRIKTNING III - PM2.5, PM10, PM1, VOC Index, CO2, Temperature and Humidity sensor with extended functionality (control of air cleaning)](http://efektalab.com/IKEA_VINDRIKTNING )',
        fromZigbee: [fz.temperature, fz.humidity, fzLocal.co2, fzLocal.temperaturef_config, fzLocal.humidity_config, fzLocal.co2_config, fzLocal.pm25, fzLocal.pm1, fzLocal.pm10, fzLocal.pm_gasstat_config, fzLocal.node_config, fzLocal.air_quality],
        toZigbee: [tz.factory_reset, tzLocal.pm_gasstat_config, tzLocal.node_config, tzLocal.co2_config, tzLocal.temperaturef_config, tzLocal.humidity_config],
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
			const endpoint2 = device.getEndpoint(2);
            const clusters = ['pm25Measurement', 'genAnalogInput', 'msCO2'];
			const clusters2 = ['msTemperatureMeasurement', 'msRelativeHumidity'];
			await reporting.bind(endpoint, coordinatorEndpoint, clusters);
			await reporting.bind(endpoint2, coordinatorEndpoint, clusters2);
			const payload1 = [{attribute: {ID: 0x0000, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 600, reportableChange: 0}];
            await endpoint.configureReporting('pm25Measurement', payload1);
			const payload2 = [{attribute: {ID: 0x00C8, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 600, reportableChange: 0}];
            await endpoint.configureReporting('pm25Measurement', payload2);
			const payload3 = [{attribute: {ID: 0x00C9, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 600, reportableChange: 0}];
			await endpoint.configureReporting('pm25Measurement', payload3);
			const payload4 = [{attribute: {ID: 0x0055, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 600, reportableChange: 0}];
			await endpoint.configureReporting('genAnalogInput', payload4);
			const payload5 = [{attribute: {ID: 0x0065, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 600, reportableChange: 0}];
			await endpoint.configureReporting('genAnalogInput', payload5);
			const payload6 = [{attribute: {ID: 0x0000, type: 0x39},
            minimumReportInterval: 0, maximumReportInterval: 300, reportableChange: 0}];
            await endpoint.configureReporting('msCO2', payload6);
			const payload7 = [{attribute: {ID: 0x0000, type: 0x29},
            minimumReportInterval: 0, maximumReportInterval: 300, reportableChange: 0}];
            await endpoint2.configureReporting('msTemperatureMeasurement', payload7);
			const payload8 = [{attribute: {ID: 0x0000, type: 0x21},
            minimumReportInterval: 0, maximumReportInterval: 300, reportableChange: 0}];
			await endpoint2.configureReporting('msRelativeHumidity', payload8);
        },
        exposes: [exposes.numeric('pm25', ea.STATE).withUnit('μg/m³').withDescription('PM2.5'),
		    exposes.numeric('pm1', ea.STATE).withUnit('μg/m³').withDescription('PM1.0'),
			exposes.numeric('pm10', ea.STATE).withUnit('μg/m³').withDescription('PM10'),
			exposes.numeric('voc_index', ea.STATE).withUnit('voc index points').withDescription('VOC INDEX'),
            exposes.numeric('voc_raw_data', ea.STATE).withUnit('ticks').withDescription('SRAW_VOC, digital raw value'),
			e.co2(),
			e.temperature(), e.humidity(),
		    exposes.numeric('reading_interval', ea.STATE_SET).withUnit('Seconds').withDescription('Setting the sensor reading interval Setting the time in seconnds, by default 30 seconds')
                .withValueMin(15).withValueMax(300),
			exposes.numeric('set_altitude', ea.STATE_SET).withUnit('meters')
			    .withDescription('Setting the altitude above sea level (for high accuracy of the CO2 sensor)')
                .withValueMin(0).withValueMax(3000),
			exposes.numeric('temperature_offset', ea.STATE_SET).withUnit('°C').withValueStep(0.1).withDescription('Adjust temperature')
                .withValueMin(-50.0).withValueMax(50.0),
            exposes.numeric('humidity_offset', ea.STATE_SET).withUnit('%').withDescription('Adjust humidity')
                .withValueMin(-50).withValueMax(50),
			exposes.binary('automatic_scal', ea.STATE_SET, 'ON', 'OFF')
			    .withDescription('Automatic self calibration'),
			exposes.binary('forced_recalibration', ea.STATE_SET, 'ON', 'OFF')
			    .withDescription('Start FRC (Perform Forced Recalibration of the CO2 Sensor)'),
			exposes.binary('factory_reset_co2', ea.STATE_SET, 'ON', 'OFF').withDescription('Factory Reset CO2 sensor'),
			exposes.binary('enable_pm25', ea.STATE_SET, 'ON', 'OFF').withDescription('Enable PM2.5 Control'),
			exposes.binary('invert_logic_pm25', ea.STATE_SET, 'ON', 'OFF').withDescription('Enable invert logic PM2.5 Control'),
            exposes.numeric('high_pm25', ea.STATE_SET).withUnit('ppm').withDescription('Setting High PM2.5 Border')
                .withValueMin(0).withValueMax(1000),
            exposes.numeric('low_pm25', ea.STATE_SET).withUnit('ppm').withDescription('Setting Low PM2.5 Border')
                .withValueMin(0).withValueMax(1000)],
};

module.exports = definition;