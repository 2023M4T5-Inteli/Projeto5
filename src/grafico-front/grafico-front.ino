#include <WiFi.h>
#include <WebServer.h>

// Importação das bibliotecas necessárias

// Insira suas credenciais de rede Wi-Fi aqui
const char* ssid = "SSID";  // SSID da rede Wi-Fi
const char* password = "SENHA";  // Senha da rede Wi-Fi

WebServer server(80);

// Configuração dos pinos e status dos LEDs
uint8_t LED1pin = 5;   // Pino do LED1
bool LED1status = LOW; // Status do LED1 (ligado/desligado)

uint8_t LED2pin = 5;   // Pino do LED2
bool LED2status = LOW; // Status do LED2 (ligado/desligado)

// Função para obter o sinal do Wi-Fi
String leituraSinalWifi() {
  int sinalWifi = WiFi.RSSI(); // Obtém o valor do sinal Wi-Fi em dBm
  
  if (isnan(sinalWifi)) {    
    Serial.println("Falha ao ler o sinal do Wi-Fi!");
    return "";
  }
  else {
    Serial.println(sinalWifi);
    return String(sinalWifi); // Retorna o valor do sinal Wi-Fi como uma string
  }
}

void setup() {
  Serial.begin(115200);
  delay(100);
  
  pinMode(LED1pin, OUTPUT); // Define o pino do LED1 como saída
  pinMode(LED2pin, OUTPUT); // Define o pino do LED2 como saída

  // Conexão com a rede Wi-Fi
  Serial.println("Conectando a ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password); // Conecta-se à rede Wi-Fi
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("Wi-Fi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP()); // Exibe o endereço IP atribuído ao ESP32

  // Configuração das rotas do servidor web
  server.on("/", handle_OnConnect);    // Página principal
  server.on("/sinalWifi", handle_led1on);    // Liga o LED1 e exibe o sinal Wi-Fi
  server.on("/desligar", handle_led1off);     // Desliga o LED1
  server.on("/led2on", handle_led2on);    // Liga o LED2
  server.on("/led2off", handle_led2off);    // Desliga o LED2
  server.onNotFound(handle_NotFound);    // Rota padrão para lidar com requisições não encontradas

  server.begin(); // Inicia o servidor web
  
  Serial.println("Servidor HTTP iniciado");
}

void loop() {
  server.handleClient(); // Processa as requisições do cliente
  
  // Controla o estado dos LEDs com base nos valores de status
  if (LED1status) {
    digitalWrite(LED1pin, HIGH);
  } else {
    digitalWrite(LED1pin, LOW);
  }
  
  if (LED2status) {
    digitalWrite(LED2pin, HIGH);
  } else {
    digitalWrite(LED2pin, LOW);
  }
}

// Manipulador para a rota principal
void handle_OnConnect() {
  LED1status = LOW;
  LED2status = LOW;
  
  Serial.println("Estado do GPIO4: DESLIGADO | Estado do GPIO5: DESLIGADO");
  
  server.send(200, "text/html", SendHTML(LED1status, LED2status)); 
}

// Manipulador para ligar o LED1 e exibir o sinal Wi-Fi
void handle_led1on() {
  LED1status = HIGH;
  
  Serial.println("Estado do GPI32: LIGADO");
  
  server.send(200, "text/html", leituraSinalWifi().c_str()); 
}

// Manipulador para desligar o LED1
void handle_led1off() {
  LED1status = LOW;
  
  Serial.println("Estado do GPI32: DESLIGADO");
  
  server.send(200, "text/html", SendHTML(true, LED2status)); 
}

// Manipulador para ligar o LED2
void handle_led2on() {
  LED2status = HIGH;
  
  Serial.println("Estado do GPIO5: LIGADO");
  
  server.send(200, "text/html", SendHTML(LED1status, true)); 
}

// Manipulador para desligar o LED2
void handle_led2off() {
  LED2status = LOW;
  
  Serial.println("Estado do GPIO5: DESLIGADO");
  
  server.send(200, "text/html", SendHTML(LED1status, true)); 
}

// Manipulador para rota não encontrada
void handle_NotFound() {
  server.send(404, "text/plain", "Página não encontrada");
}

// Função para enviar a página HTML para o cliente
String SendHTML(uint8_t led1stat, uint8_t led2stat) {
  // Criação da página HTML usando uma string
  
  // ...
  // Código HTML omitido para maior clareza
  // ...
  
  return ptr;
}
