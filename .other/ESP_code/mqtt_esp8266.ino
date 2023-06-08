#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 5
#define DHTTYPE DHT11
// Update these with values suitable for your network.

const int dht_pin = D1;

DHT dht(dht_pin, DHTTYPE);

const char* ssid = "example";
const char* password = "example";
const char* mqtt_server = "example";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(50)
char msg[MSG_BUFFER_SIZE];
int value = 0;

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1') {
    digitalWrite(BUILTIN_LED, LOW);   // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else {
    digitalWrite(BUILTIN_LED, HIGH);  // Turn the LED off by making the voltage HIGH
  }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    //Serial.println(clientId);
    const char* user = "example";
    const char* password = "example";
    // Attempt to connect
    if (client.connect(clientId.c_str(), user, password)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      
      // prepare initial data to be sent from this device
      // generated client id
      char payload_device_id[20];
      clientId.toCharArray(payload_device_id, 20);
      Serial.println(payload_device_id);
      //String message = "Device: " + clientId + " has connected to the MQTT Broker";

      // ip address
      char payload_device_ip[14];
      String localIP;
      //WiFi.localIP().toString(localIP).toCharArray(payload_device_id, 14);
      //Serial.println(payload_device_ip);
      localIP = WiFi.localIP().toString();
      localIP.toCharArray(payload_device_ip, 14);

      client.publish("device/client_id", payload_device_id); //ESP8266Client-943
      client.publish("device/client_ip", payload_device_ip);
      
      // ... and resubscribe
      client.subscribe("device/led");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup_device() {
  Serial.print("client ip to be published: ");
  Serial.println(payload_device_ip);
  client.publish("device/client_ip", payload_device_ip);
  clientID = client.subscribe("device/client_id");
  Serial.println("clientID: " + clientID);
  client.unsubscribe("device/client_id");
}

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  setup_device();
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  

  unsigned long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;
    float hum = dht.readHumidity();
    float temp = dht.readTemperature();
    
    char payload_hum[5];
    char payload_temp[5];
    
    //value = analogRead(A0) * 0.32;
    //snprintf (msg, MSG_BUFFER_SIZE, "hello world #%ld", value);
    
    /*
    dtostrf(hum, 4, 2, payload_hum);
    Serial.print("Published humidity: ");
    Serial.println(payload_hum);
    client.publish("device/hum", payload_hum);

    dtostrf(temp, 4, 2, payload_temp);
    Serial.print("Published temperature: ");
    Serial.println(payload_temp);
    client.publish("device/temp", payload_temp);
    */

    
  }
}
