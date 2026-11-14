# QUEST Events frontend

## Run locally

Open PowerShell in `D:\quest\Quest_web\frontend`, then run:

```powershell
npm install
npm run dev
```

Open the local address printed by Vite. The app contains the event browser and event registration interface; it does not include a server or database.

## Registration sheet integration

The registration form validates the fields in the browser and emits a `quest:registration-submit` window event. The event detail contains `eventKey`, `eventTitle`, `fullName`, `email`, `phone`, `usn`, `year`, `department`, and `paymentSnapshot` (a `File` or `null`). Connect the form to the club's approved sheet integration from the app layer; until then, the success notice only confirms that the form was completed in the demo and does not claim that details were stored.
