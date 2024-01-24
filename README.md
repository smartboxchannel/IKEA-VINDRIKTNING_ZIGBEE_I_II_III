# IKEA-VINDRIKTNING_ZIGBEE I, II, III

Телеграм чат DIY Devices - https://t.me/diy_devices

Продажа DIY Устройств - https://t.me/diydevmart

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/IKEA-VINDRIKTNING_01.png) 

Проект усовершенствования сенсора IKEA VINDRIKTNING. С помощью дополнительной платы с радиомодулем на чипе cc2530 мы получаем возможность отправлять данные с датчика PM1006 в сеть zigbee.

Во второй версии в проект добавлен датчик VOC SGP40.

В третьей версии в проект добавлен датчик CO2, температуры и влажности воздуха SCD40


IKEA VINDRIKTNING sensor refinement project. With the help of an additional board with a radio module on the cc2530 chip, we get the opportunity to send data from the PM1006 sensor to the zigbee network.

In the second version, the SGP40 VOC sensor was added to the project.

In the third version, the SCD40 CO2, temperature and humidity sensor was added to the project

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/009.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/008.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/001.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/015.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/027.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/SCHEMATIC/IKEA-VINDRIKTNING_ZIGBEE.png) 


Для прошивки платы необходимо подключить ее к SmartRF04EB и прошить через программу SmartRF Flash Programmer

To flash the board, you need to connect it to the SmartRF04EB and flash it through the SmartRF Flash Programmer program

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/007.png) 

Чтобы подключить плату адаптера ZigBee к основной плате, используйте следующую схему подключения.

To connect the zigbee adapter board to the main board, use the following connection diagram.

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/005.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/005_1.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/005_2.png) 

Для работы устройства в zigbee2mqtt необходимо установить соответствующий версии датчика внешний конвертер.

To operate the device in zigbee2mqtt, you must install an external converter corresponding to the sensor version.

### JOIN
Для подключения датчика к сети необходимо включить координатор в режим приема новых устройств. После этого необходимо подать питание на датчик VINDRIKTNING.

To join the sensor to the network, it is necessary to turn on the coordinator in the mode of reception of new devices. After this, it is necessary to supply power to the sensor VINDRIKTNING.


### LEAVE
Для отключения датчика от сети zigbee необходимо 3 раза подать питание на датчик, с интервалом между отключениями не более 8 секунд. На третий раз через 8 секунд датчик сделает выход из сети. (для третьей версии интервалы более длинные, 14 секунд)

To disconnect the sensor from the zigbee network, you need to apply power to the sensor 3 times, with an interval between disconnections of no more than 8 seconds. The third time, after 8 seconds, the sensor will exit the network. (for the third version the intervals are longer, 14 seconds)


### Functionality
Помимо основного функционала, датчик имеет дополнительный функционал. Добавлена ​​поддержка привязки для кластера OnOff. Датчик можно подключить к любому реле, розетке или другому исполнительному устройству, и датчик будет управлять этим реле напрямую по заданным пользователем настройкам, без участия зигби-координатора и без сценариев в вашем доме.

In addition to the main functionality, the sensor has additional functionality. Added binding support for the OnOff cluster. The sensor can be attached to any relay, socket or other executive device, and the sensor will control this relay directly according to the settings set by the user, without the participation of the zigbee coordinator and without scenarios in your home.

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/010.png) 
![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/011.png) 

Есть возможность настроить интервал считывания датчика PM1006 через сеть Zigbee, значение по умолчанию — 15 секунд.

It is possible to configure the interval reading of the PM1006 sensor via Zibbee network, the default value is 15 seconds.

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/012.png) 


Для настройки отчетов по вашим предпочтениям необходимо перенастроить свойства «Мин. интервал отчета», «Макс. интервал отчета», «Мин. интервал отчета при изменении». По умолчанию отчеты настроены как 0, 600, 0.

To configure reports based on your preferences, it is necessary to reconfigure the properties "Min. report interval", "Max. report interval", "Min. report interval when changing". By default, reports are configured as 0, 600, 0.

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/013.png) 


В ZHA датчик работает как простое устройство, без дополнительных функций. Надеюсь, кто-нибудь сможет мне с этим помочь (ZHA quirks)

In ZHA, the sensor works as a simple device, without additional features. I hope someone can help me with this (ZHA quirks)

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/006.png) 


### Clusters
![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/014.png) 
![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/014_2.png) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/0020.jpg) 
![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/0021.jpg) 

![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/0022.jpg) 
![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/0023.jpg) 
![IKEA VINDRIKTNING](https://raw.githubusercontent.com/smartboxchannel/IKEA-VINDRIKTNING_ZIGBEE/main/IMAGES/0030.jpg) 






