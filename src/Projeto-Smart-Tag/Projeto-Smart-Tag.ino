#include "UbidotsEsp32Mqtt.h"
#include <LiquidCrystal_I2C.h>

const char *UBIDOTS_TOKEN = "BBFF-QNF90wgdLx3HtT1qmU1usUzgiqjR0F";  // Coloque aqui o seu TOKEN do Ubidots

const char *WIFI_SSID = "SSID";  // Coloque aqui o SSID da sua rede Wi-Fi

const char *WIFI_PASS = "SENHA";  // Coloque aqui a senha da sua rede Wi-Fi

const char *DEVICE_LABEL = "esp-vitor";  // Coloque aqui o rótulo do seu dispositivo para o qual os dados serão publicados

const char *varSinalWifi = "sinal-wifi";  // Coloque aqui o rótulo da variável para a qual os dados serão publicados

const char *varLedUbidots = "variavel";  // Substitua pelo rótulo da variável à qual deseja se inscrever

const int PUBLISH_FREQUENCY = 2000;  // Taxa de atualização em milissegundos

unsigned long timer;

const uint8_t LED = 5;  // Pin usado para gravar dados com base em 1 e 0 provenientes de Ubidots

bool ligado = false;

// Declaração do objeto do LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Variáveis de controle de tempo e contador
int tempoContador = 3;
int contadorExibicao = 0;

Ubidots ubidots(UBIDOTS_TOKEN);

void callback(char *topic, byte *payload, unsigned int length)

{

  Serial.print("Message arrived [");

  Serial.print(topic);

  Serial.println("] ");

  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);

    if ((char)payload[0] == '1') {
      ligado = true;
      digitalWrite(LED, HIGH);
    } else {
      ligado = false;
      digitalWrite(LED, LOW);
    }
  }
  Serial.println();
}

void setup()
{
  // coloque seu código de configuração aqui, para executar uma vez:
  Serial.begin(115200);
  pinMode(LED, OUTPUT);

  lcd.begin();
  lcd.backlight();

  // ubidots.setDebug(true);  // remova o comentário para disponibilizar as mensagens de depuração

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Conectando ao WiFi..");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  exibirMensagemConexao();

  ubidots.setCallback(callback);

  ubidots.setup();

  ubidots.reconnect();

  ubidots.subscribeLastValue(DEVICE_LABEL, varLedUbidots);  // Insira os Labels do dispositivo e da variável, respectivamente
  timer = millis();
}



void loop() {
  // put your main code here, to run repeatedly:

  if (!ubidots.connected() && ligado == true) {
    ubidots.reconnect();
    ubidots.subscribeLastValue(DEVICE_LABEL, varLedUbidots);  // Insira os Labels do dispositivo e da variável, respectivamente
  }


  if (ligado) {

    if (abs(millis() - timer) > PUBLISH_FREQUENCY)  // aciona a rotina a cada 5 segundos
    {
      ubidots.reconnect();
      long value = WiFi.RSSI() + 100;
      ubidots.add(varSinalWifi, value);  // Insira suas variáveis Labels e o valor a ser enviado
      ubidots.publish(DEVICE_LABEL);

      Serial.println(value);

      lcd.clear();

      lcd.print("Sinal do Wifi:");

      lcd.setCursor(1, 1);
      lcd.print(value);

      timer = millis();

      ubidots.loop();
    }
  } else {
    ubidots.add(varSinalWifi, 0);  // Insira suas variáveis Labels e o valor a ser enviado
    ubidots.publish(DEVICE_LABEL);

    timer = millis();

    ubidots.loop();
  }
}

void exibirMensagemConexao()
{
  tempoContador = 0;
  lcd.print("Conectando");
  delay(1000);


  while (WiFi.status() != WL_CONNECTED)
  {
    if (contadorExibicao == 3)
    {
      lcd.clear();
      lcd.print("Conectando");
      contadorExibicao = 0;
    }
    lcd.print(".");
    tempoContador++;
    contadorExibicao++;
  }
      lcd.clear();
      lcd.print("Conectado a");
      lcd.setCursor(0, 1);
      lcd.print("rede Wifi");
      delay(3000);
      lcd.clear();
      lcd.print("IP do ESP local: ");
      lcd.setCursor(0, 1);
      lcd.print(WiFi.localIP());
      Serial.println();
      Serial.print("Conectado ao Wifi, IP: ");
      Serial.println(WiFi.localIP());
      delay(3000);

}