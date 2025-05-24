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
git clone https://github.com/mai25015/diavgeia-visualization.git
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

## Διαθέσιμες Εντολές

- **`npm start`**  
  Εκκινεί την εφαρμογή σε περιβάλλον ανάπτυξης.
  
- **`npm run build`**  
  Δημιουργεί ένα production build στον φάκελο `build`.
  
- **`npm test`**  
  Εκτελεί τις δοκιμές της εφαρμογής.
  
- **`npm run eject`**  
  Αποκαλύπτει τη διαμόρφωση του `react-scripts`.

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
  - Tailwind CSS (μέσω PostCSS)
