import { initializeApp, credential, messaging } from "firebase-admin"
import { Message } from "firebase-admin/lib/messaging/messaging-api"

class Fcm {

    public static init() {
        initializeApp({
            credential: credential.cert('C:/Users/minoh/ITU/L2/S4/HackAiza/app/hackaiza-backend/src/services/hackaiza-push-firebase-adminsdk-6t2ws-d4fdd6e171.json')
        })
    }

    public static message() {
        let m = messaging()

        m.send({
            token: "foAv2UNwQeiPkYCF3aAnO8:APA91bFSkFg_7cLoDYnVeOEzhpzUWT3NHkijs0CEdl3gTgx9SCeyPPKLza0XzeUNKfbE75ujHB5Nn01zF7F_NNIpdKwgLTCUF-MnwH-96SAmPdMUro04kNquoeuEeA28XrStO_W_-dpG",
            notification: {
                title: "Heyyyyy",
                body: "coucou"
            }
        }).then((res) => console.log(res))
        .catch((err) => console.log(err))
    }
}

export default Fcm