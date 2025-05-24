
# diavgeia-visualization

Το **diavgeia-visualization** είναι μια εφαρμογή React που απεικονίζει δεδομένα από το πρόγραμμα Διαύγεια. Χρησιμοποιεί διάφορες βιβλιοθήκες και εργαλεία για την ανάπτυξη, τον έλεγχο και την παρουσίαση δεδομένων.

## Περιεχόμενα

- [Περιγραφή](#περιγραφή)
- [Εγκατάσταση](#εγκατάσταση)
- [Διαθέσιμες Εντολές](#διαθέσιμες-εντολές)
- [Τεχνολογίες](#τεχνολογίες)
- [Αρχεία Παραμετροποίησης](#αρχεία-παραμετροποίησης)
- [Άδεια Χρήσης](#άδεια-χρήσης)

---

## Περιγραφή

Η εφαρμογή χρησιμοποιεί **React** για το frontend και παρέχει διεπαφή χρήστη για την προβολή και επεξεργασία δεδομένων. Χρησιμοποιεί το **Axios** για αιτήματα API και την **Recharts** για την απεικόνιση δεδομένων.

---

## Εγκατάσταση

Clone:

```bash
git clone <repository-url>
cd diavgeia-visualization
```

Install:

```bash
npm install
```

Run:

```bash
npm start
```


## Εκκίνηση Proxy Server

Η εφαρμογή περιλαμβάνει έναν **Express proxy server** για ασφαλή πρόσβαση στο API του Διαύγεια. Ο proxy υποστηρίζει:

✅ **CORS**  
✅ **Rate limiting** (10 αιτήματα/δευτερόλεπτο)  
✅ **Queueing** (μέχρι 5 ταυτόχρονες αιτήσεις)  
✅ **Βασικό authentication** για επιτρεπόμενα domains

### Παράδειγμα εκκίνησης proxy

```bash
node proxy.js
```

### Test API vs Production API

Ο proxy server είναι παραμετροποιημένος για να υποστηρίζει δύο διαφορετικά endpoints:

- **Test API**:  
  `https://test3.diavgeia.gov.gr`  
  - Χρησιμοποιείται για ανάπτυξη και δοκιμές.  
  - Απαιτεί authentication (basic auth).  

- **Production API**:  
  `https://diavgeia.gov.gr`  
  - Χρησιμοποιείται για κανονική λειτουργία σε παραγωγικό περιβάλλον.  

## Διαθέσιμες Εντολές

- **`npm start`**  
  Εκκινεί την εφαρμογή σε περιβάλλον ανάπτυξης.
  
- **`npm run build`**  
  Δημιουργεί ένα production build στον φάκελο `build`.
  
- **`npm test`**  
  Εκτελεί τις δοκιμές της εφαρμογής.
  
- **`npm run eject`**  
  Αποκαλύπτει τη διαμόρφωση του `react-scripts`.
  
- **`node proxy.js`**  
  Εκκινεί τον proxy server για αιτήματα στο API.

## Τεχνολογίες

- **Frontend**:
  - React (^19.1.0)
  - React Router DOM (^7.6.0)
  - Recharts (^2.15.3)
  
- **Backend / API Proxy**:
  - cors / cors-anywhere
  
- **Testing**:
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
  
- **Διαχείριση Αιτημάτων**:
  - Axios (^1.9.0)
  
- **CSS**:
  - Tailwind CSS (μέσω PostCSS)## Διαθέσιμες Εντολές

