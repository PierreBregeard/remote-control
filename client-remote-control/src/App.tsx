import {
    IonApp, IonButton, IonCol, IonContent, IonFooter, IonGrid, IonIcon, IonInput, IonItem, IonRange, IonRow,
    setupIonicReact, useIonAlert, useIonLoading
} from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import "./theme/App.css";
import {useEffect, useState} from "react";
import {Preferences} from "@capacitor/preferences";
import {caretForward, playBack, playForward, volumeHigh, volumeLow} from "ionicons/icons";

setupIonicReact();

const App: React.FC = () => {

  const [ip, setIp] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentAlert] = useIonAlert();

    useEffect(() => {
        (async () => {
            const { value } = await Preferences.get({ key: "ip" });
            if (value) {
                setIp(JSON.parse(value));
            }
        })()
    }, []);

    function fetchTimeout(url: string,timeout = 2000) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), timeout)
            )
        ]);
    }

    const API = () => `http://${ip}`;

  async function connect() {
      setIsConnected(false)
      await presentLoading("Connexion en cours...");
      try {
          await fetchTimeout(API(), 2000);
          await dismissLoading();
          setIsConnected(true);
          await Preferences.set({ key: "ip", value: JSON.stringify(ip) });
      } catch(e) {
            await dismissLoading();
            await presentAlert({
                header: "Erreur",
                message: (e as Error).message || "Impossible de se connecter au serveur",
                buttons: ["OK"]
            });
      }
  }

  async function send_key(k: string) {
        await fetch(`${API()}/press_key?key=${k}`);
  }

  async function send_volume(v: number) {
        await fetch(`${API()}/set_volume?vol=${v}`);
  }

  function main() {
      if (!isConnected) {
          return (
              <IonRow className="ion-justify-content-center">
                  <IonButton onClick={connect}>Connexion</IonButton>
              </IonRow>
          );
      }
      return (
            <>
                <IonRow className="ion-justify-content-center">
                    <div style={{width: "80vw"}}>
                        <IonRange onIonChange={
                            (e) => send_volume(e.detail.value as number)
                        }>
                            <IonIcon slot="start" size={"large"} icon={volumeLow}>0</IonIcon>
                            <IonIcon slot="end" size={"large"} icon={volumeHigh}>100</IonIcon>
                        </IonRange>
                    </div>
                </IonRow>
                <IonRow className="ion-justify-content-center">
                    <div style={{
                        width: "80vw",
                        display: "flex",
                        justifyContent: "space-evenly",
                    }}>
                        <IonIcon className="clickable" onClick={() => send_key("next_track")} icon={playBack} size={"large"} />
                        <IonIcon className="clickable" onClick={() => send_key("pp_media")} icon={caretForward} size={"large"} />
                        <IonIcon className="clickable" onClick={() => send_key("previous_track")} icon={playForward} size={"large"} />
                    </div>
                </IonRow>
            </>
      )
  }

  return (
      <IonApp>
        <IonContent>
          <IonGrid style={{
              height: "100%",
              display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              gap: "2em"
          }}>
              <IonRow className="ion-justify-content-center">
                  <IonCol>
                      <IonItem style={{
                          borderRadius: ".3em",
                      }}>
                          <IonInput onIonInput={(e) => {
                              setIp(e.detail.value!)
                              setIsConnected(false)
                          }} label="IP" value={ip} placeholder="ex: 192.168.1.6:5000"/>
                      </IonItem>
                  </IonCol>
              </IonRow>
              <IonRow className="clickable" style={{
                  width: "80vw",
                  height: "2em",
                  borderRadius: "1em",
                  backgroundColor: isConnected ? "green": "red",
              }} onClick={connect}>
              </IonRow>
              {main()}
          </IonGrid>
        </IonContent>
          <IonFooter>
              <span style={{
                  display: "flex",
                  justifyContent: "center",
                    alignItems: "center",
                    height: "2em",
                  fontSize: ".8em",
                  color: "#979797",
              }}>
                  © 2024 - πR
              </span>
          </IonFooter>
      </IonApp>
  );
}

export default App;
