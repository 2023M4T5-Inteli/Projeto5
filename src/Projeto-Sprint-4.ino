#include <LiquidCrystal_I2C.h>

// Declaração das constantes e pinos
int ledVermelho = 16;
int nivelBotao;
int botao = 15;
int estadoBotao = 0;

// Declaração do objeto do LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Variáveis de controle de tempo e contador
int tempoContador = 3;
int contadorExibicao = 0;
String mensagem;
String ip;

// Função de inicialização
void setup()
{
  lcd.begin();
  lcd.noBacklight();
  Serial.begin(115200);

  pinMode(botao, OUTPUT);      // Define o botão como saída
  pinMode(ledVermelho, OUTPUT); // Define o LED como saída
}

// Função que exibe a mensagem de conexão no LCD
void exibirMensagemConexao(String ip)
{
  tempoContador = 0;
  lcd.print("Conectando");
  delay(1000);

  while (tempoContador <= 9)
  {
    if (contadorExibicao == 3)
    {
      lcd.clear();
      lcd.print("Conectando");
      contadorExibicao = 0;
    }
    lcd.print(".");
    delay(1000);
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
  lcd.print(ip);
}

// Função para lidar com os eventos do botão
void lidarComEventosBotao()
{
  nivelBotao = digitalRead(botao);

  if (nivelBotao == 1 && estadoBotao == 0)
  {
    estadoBotao = 1;

    lcd.backlight();
    lcd.display();
    lcd.clear();

    exibirMensagemConexao("12.345.678.9");

    digitalWrite(ledVermelho, HIGH);
    delay(1000);
    Serial.println(String(estadoBotao));
  }
  else if (nivelBotao == 1 && estadoBotao == 1)
  {
    estadoBotao = 0;
    lcd.clear();
    lcd.print("Desconectado");
    digitalWrite(ledVermelho, LOW);
    delay(2000);
    lcd.noBacklight();
    lcd.noDisplay();
  }
}

void loop()
{
  lidarComEventosBotao();
}
