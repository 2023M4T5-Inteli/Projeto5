#include "UbidotsEsp32Mqtt.h"
#include "SSD1306Wire.h"

// Configuração do Ubidots
const char *UBIDOTS_TOKEN = "TOKEN-UBIDOTS"; // Insira aqui o seu TOKEN do Ubidots
const char *DEVICE_LABEL = "LABEL-DISPOSITIVO"; // Insira aqui o Label do seu dispositivo para o qual os dados serão publicados
const char *varSinalWifi = "VARIAVEL-SINAL"; // Insira aqui o Label da variável para a qual os dados serão publicados
const char *varLedUbidots = "VARIAVEL-LED"; // Substitua pelo Label da variável à qual deseja se inscrever
const int FREQUENCIA_PUBLICACAO = 2000; // Taxa de atualização em milissegundos

// Configuração da rede Wi-Fi
const char *WIFI_SSID = "SSID"; // Insira aqui o SSID da sua rede Wi-Fi
const char *WIFI_PASS = "SENHA"; // Insira aqui a senha da sua rede Wi-Fi

// Configuração dos pinos
const uint8_t portaLedMQTT = 5; // Pino usado para gravar dados com base em 1 e 0 provenientes de Ubidots
const uint8_t ledSinalRuim = 27;
const uint8_t ledConectado = 14;

// Configuração do display OLED
SSD1306Wire display(0x3c, 4, 15);

// Outras variáveis globais
bool ligado = false;
String local;

LiquidCrystal_I2C lcd(0x27, 16, 2); // Declaração do objeto LCD
Ubidots ubidots(UBIDOTS_TOKEN); // Declaração do objeto Ubidots com o TOKEN que foi inserido na variável UBIDOTS_TOKEN

// Função de callback para tratamento de mensagens MQTT recebidas
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  // Implemente o tratamento de mensagens MQTT recebidas
}

// Função para realizar a configuração inicial
void setup()
{
  Serial.begin(115200);

  pinMode(portaLedMQTT, OUTPUT);
  pinMode(ledSinalRuim, OUTPUT);
  pinMode(ledConectado, OUTPUT);

  // Configuração inicial do display OLED
  display.init();
  display.drawString(0, 0, "");
  display.drawString(0, 20, "");
  display.drawString(0, 40, "");
  display.display();

  // Conexão à rede Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Conectando");
  }
  Serial.print("Conectado à rede Wi-Fi. Endereço IP: ");
  Serial.println(WiFi.localIP());

  // Identificação do local
  if (WiFi.localIP().toString() == COLLEGE)
  {
    local = "COLLEGE";
    Serial.println("Seu " + String(DEVICE_LABEL) + " está no: " + local);
  }
  else if (WiFi.localIP().toString() == WELCOME)
  {
    local = "WELCOME";
    Serial.println("Seu " + String(DEVICE_LABEL) + " está no: " + local);
  }
  else
  {
    local = "PERDIDO";
    Serial.println();
  }

  // Configuração do Ubidots
  ubidots.setCallback(mqttCallback);
  ubidots.setup();
  ubidots.reconnect();
  ubidots.subscribeLastValue(DEVICE_LABEL, varLedUbidots);

  // Inicialização do timer
  timer = millis();
}

// Função principal executada continuamente
void loop()
{
  if (!ubidots.connected() && ligado)
  {
    ubidots.reconnect();
    ubidots.subscribeLastValue(DEVICE_LABEL, varLedUbidots);
  }

  if (ligado)
  {
    if (abs(millis() - timer) > FREQUENCIA_PUBLICACAO)
    {
      ubidots.reconnect();
      long value = WiFi.RSSI() + 100;
      ubidots.add(varSinalWifi, value);
      ubidots.publish(DEVICE_LABEL);

      Serial.println(value);
      display.display();
      display.drawString(0, 20, "Local Atual: " + local);

      if (local == localAdequado)
      {
        display.drawString(0, 40, "Status OK!");
      }
      else
      {
        display.drawString(0, 40, "Alerta!");
      }

      timer = millis();

      ubidots.loop();
      if (value <= 30)
      {
        alerta = true;
      }
      else
      {
        alerta = false;
      }
      if (alerta)
      {
        digitalWrite(ledSinalRuim, HIGH);
      }
      else
      {
        digitalWrite(ledSinalRuim, LOW);
      }
    }
  }
  else
  {
    ubidots.add(varSinalWifi, 0);
    ubidots.publish(DEVICE_LABEL);

    timer = millis();
    digitalWrite(alerta, LOW);
    ubidots.loop();
  }
}