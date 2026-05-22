import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyAJSAgwdl4bGraCzrdTRh8dHsDCx66f47M",

  authDomain: "holistik-funrun-59537.firebaseapp.com",

  projectId: "holistik-funrun-59537",

  storageBucket: "holistik-funrun-59537.firebasestorage.app",

  messagingSenderId: "240587003368",

  appId: "1:240587003368:web:920208cfcf4a8a97d4c05d",

  measurementId: "G-WK7DGLS59X"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const adminEmails = [
  "everteestudio@gmail.com"
];

window.loginGoogle = async function () {

  try {

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    if (adminEmails.includes(user.email)) {

      window.location.href = "admin.html";

    } else {

      window.location.href = "dashboard.html";

    }

  } catch (error) {

    alert(error.message);

  }

};

window.logoutUser = async function () {

  await signOut(auth);

  window.location.href = "index.html";

};

window.saveRegistration = async function (event) {

  event.preventDefault();

  const user = auth.currentUser;

  await addDoc(collection(db, "participants"), {

    uid: user.uid,
    email: user.email,

    name: document.getElementById("name").value,

    school: document.getElementById("school").value,

    jersey: document.getElementById("jersey").value,

    paymentStatus: "pending",

    bibNumber: "",

    jerseyTaken: false,

    createdAt: new Date()

  });

  alert("Pendaftaran berhasil");

};

window.loadParticipants = async function () {

  const tbody = document.getElementById("participantTable");

  if (!tbody) return;

  tbody.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "participants"));

  let counter = 1;

  querySnapshot.forEach((documentData) => {

    const data = documentData.data();

    const row = `

      <tr class="border-b">

        <td class="p-4">${data.name}</td>

        <td class="p-4">${data.school}</td>

        <td class="p-4">${data.jersey}</td>

        <td class="p-4">${data.paymentStatus}</td>

        <td class="p-4">${data.bibNumber || '-'}</td>

        <td class="p-4 flex gap-2">

          <button
            onclick="approveParticipant('${documentData.id}', ${counter})"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Approve
          </button>

          <button
            onclick="markJerseyTaken('${documentData.id}')"
            class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl"
          >
            Jersey
          </button>

        </td>

      </tr>

    `;

    tbody.innerHTML += row;

    counter++;

  });

};

window.approveParticipant = async function (id, number) {

  const bib = `RUN-${String(number).padStart(4, '0')}`;

  await updateDoc(doc(db, "participants", id), {

    paymentStatus: "approved",

    bibNumber: bib

  });

  alert("Peserta berhasil diapprove");

  location.reload();

};

window.markJerseyTaken = async function (id) {

  await updateDoc(doc(db, "participants", id), {

    jerseyTaken: true

  });

  alert("Jersey sudah diambil");

};
