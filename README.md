# IKEA-VINDRIKTNING_ZIGBEE

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/IKEA-VINDRIKTNING.png) 

Проект усовершенствования сенсора IKEA VINDRIKTNING. С помощью дополнительной платы с радиомодулем на чипе cc2530 мы получаем возможность отправлять данные с датчика PM1006 в сеть zigbee.

IKEA VINDRIKTNING sensor refinement project. With the help of an additional board with a radio module on the cc2530 chip, we get the opportunity to send data from the PM1006 sensor to the zigbee network.

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/009.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/008.png) 


Для прошивки платы необходимо подключить ее к SmartRF04EB и прошить через программу SmartRF Flash Programmer

To flash the board, you need to connect it to the SmartRF04EB and flash it through the SmartRF Flash Programmer program

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/007.png) 

Для прошивки платы необходимо подключить ее к SmartRF04EB и прошить через программу SmartRF Flash Programmer

To connect the zigbee adapter board to the main board, use the following connection diagram.

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/005.png) 

Для работы устройства в zigbee2mqtt необходимо установить внешний конвертер.

For the device to work in zigbee2mqtt, it is necessary to install an external converter.

### JOIN
Для подключения датчика к сети необходимо включить координатор в режим приема новых устройств. После этого необходимо подать питание на датчик VINDRIKTNING.

To join the sensor to the network, it is necessary to turn on the coordinator in the mode of reception of new devices. After this, it is necessary to supply power to the sensor VINDRIKTNING.


### LEAVE
Для отключения датчика от сети zigbee необходимо 4 раза отключить датчик от питания, с интервалом между отключениями не более 8 секунд.

To remove the sensor from the zigbee network, it is necessary to disconnect the sensor from the power supply 4 times, with an interval between disconnections of no more than 8 seconds.


### Functionality
Помимо основного функционала, датчик имеет дополнительный функционал. Добавлена ​​поддержка привязки для кластера OnOff. Датчик можно подключить к любому реле, розетке или другому исполнительному устройству, и датчик будет управлять этим реле напрямую по заданным пользователем настройкам, без участия зигби-координатора и без сценариев в вашем доме.

In addition to the main functionality, the sensor has additional functionality. Added binding support for the OnOff cluster. The sensor can be attached to any relay, socket or other executive device, and the sensor will control this relay directly according to the settings set by the user, without the participation of the zigbee coordinator and without scenarios in your home.

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/010.png) 
![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/011.png) 

Есть возможность настроить интервал считывания датчика PM1006 через сеть Wi-Fi, значение по умолчанию — 15 секунд.

It is possible to configure the interval reading of the PM1006 sensor via a Wi-Fi network, the default value is 15 seconds.

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/012.png) 





