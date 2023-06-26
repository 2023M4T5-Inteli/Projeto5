#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "time.h"

// Fornecer informações sobre o processo de geração de token.
#include "addons/TokenHelper.h"
// Fornecer informações de impressão da carga útil do RTDB e outras funções auxiliares.
#include "addons/RTDBHelper.h"

// Defina as redes Wi-Fi às quais deseja se conectar
const char* ssid1 = "WIFI-1";
const char* password1 = "SENHA-1";
const char* ssid2 = "WIFI-2";
const char* password2 = "SENHA-2";
const char* ssid3 = "WIFI-3";
const char* password3 = "SENHA3";
const char* ssid4 = "WIFI-4";
const char* password4 = "SENHA-4";
const char* ssid5 = "WIFI-5";
const char* password5 = "SENHA-5";

// Insira sua chave de API do projeto Firebase
#define API_KEY "SUA_CHAVE_API"

// Insira um e-mail autorizado e a senha correspondente
#define USER_EMAIL "SEU_EMAIL"
#define USER_PASSWORD "SUA_SENHA"

// Inserir URL RTDB (Defina o URL do RTDB)
#define DATABASE_URL "URL_DO_RTDATABASE"

// Define objetos do Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variável para salvar o UID do USUÁRIO
String uid;

// Caminho principal do banco de dados (será atualizado no setup com o UID do usuário)
String databasePath;
// Nós filhos do banco de dados
String tempPath = "/temperature";
String distancePath = "/distance";
String timePath = "/timestamp";
String setorPath = "/setor";
String houveMudancaSetorPath = "/houveMudanca";

// Nó pai (será atualizado em cada loop)
String parentPath;

int timestamp;
int sinalWifi;
FirebaseJson json;

const char* ntpServer = "pool.ntp.org";

unsigned long sendDataPrevMillis = 0;
unsigned long tempoInicial;
unsigned long intervalo = 30000; // intervalo de 30 segundos em milissegundos
unsigned long timerDelay = 1000; // intervalo de 1 segundo em milissegundos
bool primeiroScanRealizado = false;

String setorAtual = "";  // Variável para armazenar o setor atual

// Inicialize o WiFi
void initWiFi() {
  Serial.println("Escaneando redes Wi-Fi...");
  int numRedes = WiFi.scanNetworks();

  primeiroScanRealizado = true;

  if (numRedes == 0) {
    Serial.println("Nenhuma rede encontrada.");
  } else {
    Serial.print(numRedes);
    Serial.println(" redes encontradas.");

    int melhorRede = -1;
    int melhorRSSI;

    for (int i = 0; i < numRedes; ++i) {
      String ssid = WiFi.SSID(i);
      int rssi = WiFi.RSSI(i);

      Serial.print("Rede encontrada: ");
      Serial.print(ssid);
      Serial.print(" (");
      Serial.print(rssi);
      Serial.println(" dBm)");

      // Verifica se a rede atual está entre as redes desejadas
      if (ssid.equals(ssid1) || ssid.equals(ssid2) || ssid.equals(ssid3) || ssid.equals(ssid4) || ssid.equals(ssid5)) {
        if (melhorRede == -1 || rssi > melhorRSSI) {
          melhorRede = i;
          melhorRSSI = rssi;
        }
      }
    }

    if (melhorRede != -1) {
      String melhorSSID = WiFi.SSID(melhorRede);
      Serial.print("Conectando à rede: ");
      Serial.println(melhorSSID);

      if (melhorSSID.equals(ssid1)) {
        WiFi.begin(ssid1, password1);
      } else if (melhorSSID.equals(ssid2)) {
        WiFi.begin(ssid2, password2);
      } else if (melhorSSID.equals(ssid3)) {
        WiFi.begin(ssid3, password3);
      } else if (melhorSSID.equals(ssid4)) {
        WiFi.begin(ssid4, password4);
      } else if (melhorSSID.equals(ssid5)) {
        WiFi.begin(ssid5, password5);
      }

      while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
      }

      Serial.println("");
      Serial.println("Conectado à rede Wi-Fi.");
      Serial.print("Endereço IP: ");
      Serial.println(WiFi.localIP());
    } else {
      Serial.println("Nenhuma rede desejada disponível.");
    }
  }
}

// Função que obtém o tempo epoch atual
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Falha ao obter o tempo");
    return(0);
  }
  time(&now);
  return now;
}

void setup(){
  Serial.begin(115200);
  tempoInicial = millis(); // registra o tempo inicial

  // Obter o setor inicial quando a conexão Wi-Fi for estabelecida
  setorAtual = getCurrentSector();

  initWiFi();

  configTime(0, 0, ntpServer);

  // Atribuir a chave da API (obrigatório)
  config.api_key = API_KEY;

  // Atribuir as credenciais de login do usuário
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Atribuir o URL do RTDB (obrigatório)
  config.database_url = DATABASE_URL;

  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  // Atribuir a função de retorno de chamada para a tarefa de geração de token de longa duração
  config.token_status_callback = tokenStatusCallback; //consulte addons/TokenHelper.h

  // Atribuir o número máximo de tentativas de geração de token
  config.max_token_generation_retry = 5;

  // Inicializar a biblioteca com a autenticação e configuração do Firebase
  Firebase.begin(&config, &auth);

  // A obtenção do UID do usuário pode levar alguns segundos
  Serial.println("Obtendo UID do usuário");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
    if(WiFi.status() != WL_CONNECTED) {
      initWiFi();
    }
  }
  // Imprimir o UID do usuário
  uid = auth.token.uid.c_str();
  Serial.print("UID do usuário: ");
  Serial.println(uid);

  // Atualizar o caminho do banco de dados
  databasePath = "/UsersData/" + uid + "/readings";
}

void loop(){
  // Verificar periodicamente se houve mudança de setor
  String newSector = getCurrentSector();

  unsigned long tempoAtual = millis(); // obtém o tempo atual

  if (tempoAtual - tempoInicial >= intervalo) {
    tempoInicial = tempoAtual; // redefine o tempo inicial
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();
    initWiFi();
  }
  // Enviar novas leituras para o banco de dados
  else {
    if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)){
      sendDataPrevMillis = millis();

      // Obter o timestamp atual
      timestamp = getTime();
      Serial.print ("tempo: ");
      Serial.println (timestamp);

      uint8_t mac[6];
      WiFi.macAddress(mac);

      char macStr[18];
      snprintf(macStr, sizeof(macStr), "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
      
      parentPath = databasePath  + "/" + String(timestamp) + "/" + macStr;

      // Obter o sinal RSSI da conexão Wi-Fi
      int32_t rssi = WiFi.RSSI();
      Serial.print("RSSI: ");
      Serial.println(rssi);

      // Calcular a distância aproximada com base no sinal RSSI
      float distance = calculateDistance(rssi);
      Serial.print("Distância aproximada: ");
      Serial.print(distance);
      Serial.println(" metros");
      json.set(distancePath, String(distance));
      json.set(tempPath, String(rssi));
      if (newSector != setorAtual) {
        setorAtual = newSector;
        Serial.println("Houve mudança de setor: " + setorAtual);
        json.set(setorPath, String(setorAtual));
        json.set(houveMudancaSetorPath, "Sim");
      }
      else {
        Serial.println("Não houve mudança de setor: " + setorAtual);
        json.set(setorPath, String(setorAtual));
        json.set(houveMudancaSetorPath, "Não");
      }
      json.set(timePath.c_str(), String(timestamp));
      Serial.printf("Definir JSON... %s\n", Firebase.RTDB.setJSON(&fbdo, parentPath.c_str(), &json) ? "ok" : fbdo.errorReason().c_str());
    }
  }
}

float calculateDistance(int32_t rssi) {
  int txPower = -59; // Potência do sinal em dBm na distância de referência (1 metro)
  float ratio = rssi * 1.0 / txPower;
  if (ratio < 1.0) {
    return pow(ratio, 10);
  } else {
    float distance = 0.89976 * pow(ratio, 7.7095) + 0.111;
    return distance;
  }
}

String getCurrentSector() {
  String ssid = WiFi.SSID();  // Obter o nome da rede Wi-Fi conectada
  
  // Lógica para determinar o setor com base no nome da rede Wi-Fi
  if (ssid.startsWith("WIFI-1")) {
    return "SETOR 1";
  } else if (ssid.startsWith("WIFI-2")) {
    return "SETOR 2";
  } else if (ssid.startsWith("WIFI-3")) {
    return "SETOR 3";
  } else if (ssid.startsWith("WIFI-4")) {
    return "SETOR 4";
  } else if (ssid.startsWith("WIFI-5")) {
    return "SETOR 5";
  } else {
    return "DESCONHECIDO";
  }
}
