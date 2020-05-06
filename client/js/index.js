import { environment } from './environment.js';
const { urlApi } = environment;
let userToken = '';

/** Ajout d'un utilisateur via les données formulaire */
document.formSignUp.addEventListener('submit', async function(e) {
  e.preventDefault();

  let user = {};
  new FormData(this).forEach((v, k) => user[k] = v);

  const res = await fetch(`${urlApi}/signup`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  const data = await res.json();
  this.firstElementChild.textContent = data.message || "L'utilisateur a bien été enregistré !";
  setTimeout(() => this.firstElementChild.textContent = "", 3000);
});

/** Login utilisateur et affichage des messages et services */
document.formLogIn.addEventListener('submit', async function(e) {
    e.preventDefault();
  
    let user = {};
    new FormData(this).forEach((v, k) => user[k] = v);
  
    const res = await fetch(`${urlApi}/login`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  
    const data = await res.json();
  
    if (data && data.user) {
      let navHTML = "";
      $('#modalCenter').modal('hide');
      $('#connexion').button('hide');
      $('#list').show();
      $('#profil').show();
      $('#addPost').show();
      $('#formSignUp').hide();
      userToken = data.token;
      navHTML = `<h1>OurSpot</h1> 
      <div class="justify-content-end">
      Bienvenue ${data.user.firstname} ! <br> <a href="">Se déconnecter<a> </div>`;
      document.querySelector('#header').innerHTML = navHTML;
    }
    sessionStorage.setItem("idUser", data.user._id);
  
    const res2 = await fetch(`${urlApi}/posts`);
    const data2 = await res2.json();
    if (data2 && data2.posts) {
      let usersHTML2 = "";
      for (let { _id, message, userid, createdat, updatedat } of data2.posts) {
        usersHTML2 += `
          <div class="post mt-2">
            <h4>${userid}</h4>
            <h5>${message}</h5>
            <h6>posté le: ${createdat} <br>modifié le: ${updatedat}</h6>
          </div>
          <hr />
        `;
      document.querySelector('.posts').innerHTML = usersHTML2;
      }
    }
  });

  /** Ajout d'un nouveau message */
  document.formAddPost.addEventListener('submit', async function(e) {
    e.preventDefault();
    let post = {};
    new FormData(this).forEach((v, k) => post[k] = v);
  
    const res = await fetch(`${urlApi}/post`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
  
    const data = await res.json();
    
  });

  /** Affiche la liste des utilisateurs */
  document.querySelector('.get-users').addEventListener('click', async () => {
    const res = await fetch(`${urlApi}/users`, {
      headers: { 'Authorization': userToken },
    });
    const data = await res.json();
    if (data && data.users) {
      let usersHTML = "";
      for (let { _id, firstname, lastname, email, pseudo } of data.users) {
        usersHTML += `
          <div class="user mt-2">
            <h4>${_id}</h4>
            <h5>${firstname} ${lastname}</h5>
            <h6>Email: ${email} - Pseudo: ${pseudo}</h6>
          </div>
          <hr />
        `;
        $('#hide').show();
        document.querySelector('.users').innerHTML = usersHTML;
      }
    
    }
  });

  /** Masque la liste des utilisateurs */
  document.querySelector('.hide-users').addEventListener('click', async () => {
    document.querySelector('.users').innerHTML = "";
    $('#hide').hide();
  });

  /** Affiche les données du profil connecté */
  document.querySelector('#profil').addEventListener('click', async () => {
    $('#update-profil').show();
    $('#list').hide();
    $('#profil').hide();
    let idUser = sessionStorage.getItem("idUser");
    const res = await fetch(`${urlApi}/users/${idUser}`, {
      headers: { 'Authorization': userToken },
    });
    const data = await res.json();
    // if (data && data.users) {
    document.updateProfil.firstname.value = data.user.firstname;
    document.updateProfil.lastname.value = data.user.lastname;
    document.updateProfil.pseudo.value = data.user.pseudo;
    document.updateProfil.email.value = data.user.email;
  });

  /** Modifie les données du profil connecté -- A débugger... */
  document.updateProfil.addEventListener('submit', async function(e) {
    e.preventDefault();
  
    let user = {};
    new FormData(this).forEach((v, k) => user[k] = v);
    let idUser = sessionStorage.getItem("idUser");
    const res = await fetch(`${urlApi}/users/${idUser}`, {
      method: 'put',
      headers: { 'Authorization': userToken },
      body: JSON.stringify(user),
    });
    const data = await res.json();
  });

  /** Annule l'affichage des données du profil connecté */
  document.querySelector('.annulerProfil').addEventListener('click', async () => {
    $('#list').show();
    $('#profil').show();
    $('#update-profil').hide();
  });

 