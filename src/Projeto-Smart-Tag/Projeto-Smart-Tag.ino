#include "UbidotsEsp32Mqtt.h"
#include <LiquidCrystal_I2C.h>

const char *UBIDOTS_TOKEN = "TOKEN";  // Insira aqui o seu TOKEN do Ubidots
const char *WIFI_SSID = "SSID";  // Insira aqui o SSID da sua rede Wi-Fi
const char *WIFI_PASS = "SENHA";  // Insira aqui a senha da sua rede Wi-Fi
const char *DEVICE_LABEL = "esp-vitor";  // Insira aqui o Label do seu dispositivo para o qual os dados serão publicados
const char *varSinalWifi = "sinal-wifi";  // Insira aqui o Label da variável para a qual os dados serão publicados
const char *varLedUbidots = "variavel";  // Substitua pelo Label da variável à qual deseja se inscrever
const int FREQUENCIA_PUBLICACAO = 2000;  // Taxa de atualização em milissegundos

const uint8_t portaLedMQTT = 5;  // Pino usado para gravar dados com base em 1 e 0 provenientes de Ubidots

// Variáveis de controle de tempo, contador e estado
unsigned long timer;
int contadorExibicao = 3;
bool ledLigado = false;


LiquidCrystal_I2C lcd(0x27, 16, 2);  // Declaração do objeto LCD
Ubidots ubidots(UBIDOTS_TOKEN);  // Declaração do objeto Ubidots com o TOKEN que foi inserido na variável UBIDOTS_TOKEN


// Função de callback para tratamento de mensagens MQTT recebidas
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.println("] ");

  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);

    if ((char)payload[0] == '1') {
      ledLigado = true;
      digitalWrite(portaLedMQTT, HIGH);
    } else {
      ledLigado = false;
      digitalWrite(portaLedMQTT, LOW);
    }
  }

  Serial.println();
}

// Função de configuração inicial
void setup()
{
  Serial.begin(115200);
  pinMode(portaLedMQTT, OUTPUT);

  lcd.begin();
  lcd.backlight();

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  exibirMensagemConexao();

  Serial.println();
  Serial.print("Conectado ao Wifi, IP: ");
  Serial.println(WiFi.localIP());

  ubidots.setCallback(mqttCallback);

  ubidots.setup();

  ubidots.reconnect();

  ubidots.subscribeLastValue(DEVICE_LABEL, varLedUbidots);  // Inserir os Labels do dispositivo e da variável, respectivamente
  timer = millis();
}

// Função principal executada continuamente
void loop() {
  if (!ubidots.connected() && ledLigado == true) {
    ubidots.reconnect();
    ubidots.subscribeLastValue(DEVICE_LABEL, varLedUbidots);  // Inserir os Labels do dispositivo e da variável, respectivamente
  }

  if (ledLigado) {
    if (abs(millis() - timer) > FREQUENCIA_PUBLICACAO) {
      ubidots.reconnect();
      long value = WiFi.RSSI() + 100;
      ubidots.add(varSinalWifi, value);  // Inserir Labels de variáveis e o valor a ser enviado
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
    ubidots.add(varSinalWifi, 0);  // Inserir Labels de variáveis e o valor a ser enviado
    ubidots.publish(DEVICE_LABEL);

    exibirMensagemConexao();
    timer = millis();

    ubidots.loop();
  }
}

// Função para exibir mensagens durante o processo de conexão Wi-Fi
void exibirMensagemConexao()
{
//Enquanto o Wi-Fi não estiver conectado, este trecho de código vai rodar
  while (WiFi.status() != WL_CONNECTED)
  {
    if (contadorExibicao == 3)
    {
      lcd.clear();
      lcd.print("Conectando");
      contadorExibicao = 0;
    }
    lcd.print(".");
    delay(500);
    contadorExibicao++;
  }

}
// Quando o ESP32 estiver conectado ao Wi-Fi e ainda não estiver subscrevendo ou publicando em tópicos MQTT, este código vai rodar
  lcd.clear();
  lcd.print("Conectado a");
  lcd.setCursor(0, 1);
  lcd.print("rede Wifi");
  delay(3000);
  lcd.clear();
  lcd.print("IP do ESP local: ");
  lcd.setCursor(0, 1);
  lcd.print(WiFi.localIP());
  delay(3000);
}
