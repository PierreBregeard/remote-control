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
import {useCallback, useEffect, useState} from "react";
import {caretForward, playBack, playForward, volumeHigh, volumeLow} from "ionicons/icons";

setupIonicReact();

const App: React.FC = () => {

  const [connexionState, setConnexionState] = useState<"connected" | "loading" | "notConnected">("notConnected");
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentAlert] = useIonAlert();

    useEffect(() => {
        (async () => {
            await connect()
        })();
    }, []);

    function fetchTimeout(url: string, timeout = 2000) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), timeout)
            )
        ]);
    }

    async function fecth_api(endpoint = "/ping", isPresentLoading = true) {
        setConnexionState("loading");
        if (isPresentLoading) {
            await presentLoading("Connexion en cours...");
        }
        try {
            // await fetchTimeout(endpoint, 2000);
            await fetchTimeout(`http://192.168.100.150:5000${endpoint}`, 2000);
            await dismissLoading();
            setConnexionState("connected")
        } catch(e) {
            setConnexionState("notConnected");
            await dismissLoading();
            await presentAlert({
                header: "Erreur",
                message: (e as Error).message || "Impossible de se connecter au serveur",
                buttons: ["OK"]
            });
        }
    }

    const connect = useCallback(async () => {
        await fecth_api();
    }, []);

  async function send_key(k: string) {
        await fecth_api(`/press_key?key=${k}`, false);
  }

  async function send_volume(v: number) {
        await fecth_api(`/set_volume?vol=${v}`, false);
  }

  function getDivColor() {
    return {
        "connected": "green",
        "loading": "orange",
        "notConnected": "red",
    }[connexionState]
  }

  function main() {
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
                        <IonIcon className="clickable" onClick={() => send_key("previous_track")} icon={playBack} size={"large"} />
                        <IonIcon className="clickable" onClick={() => send_key("pp_media")} icon={caretForward} size={"large"} />
                        <IonIcon className="clickable" onClick={() => send_key("next_track")} icon={playForward} size={"large"} />
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
              <IonRow id="connexionStateDiv" className="clickable" style={{
                  width: "80vw",
                  height: "2em",
                  borderRadius: "1em",
                  backgroundColor: getDivColor(),
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
