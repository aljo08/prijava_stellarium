var prijava = document.getElementById("stran-prijava");
    var registracija = document.getElementById("stran-registracija");

    function pokazi(stran) {
      var reg = stran === "registracija";
      registracija.hidden = !reg;
      prijava.hidden = reg;
      document.title = reg ? "Lunara – Registracija" : "Lunara – Prijava";
      window.scrollTo(0, 0);
    }

    document.querySelectorAll("[data-stran]").forEach(function (povezava) {
      povezava.addEventListener("click", function (e) {
        e.preventDefault();
        var stran = povezava.getAttribute("data-stran");
        history.replaceState(null, "", "#" + stran);
        pokazi(stran);
      });
    });

    var tema = {
      background: "#14163a",
      color: "#e8e9f3",
      confirmButtonColor: "#ffb347",
      cancelButtonColor: "#4a4f7a",
      confirmButtonText: "V redu"
    };

    function obvestilo(moznosti) {
      return Swal.fire(Object.assign({}, tema, moznosti));
    }

    document.querySelectorAll("form").forEach(function (f) {
      f.noValidate = true;
    });

    ["input", "change"].forEach(function (dogodek) {
      document.addEventListener(dogodek, function (e) {
        if (e.target && e.target.classList) {
          e.target.classList.remove("napaka");
        }
      });
    });

    var regEmail =/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function prikaziNapake(napake) {
      document.querySelectorAll(".napaka").forEach(function (el) {
        el.classList.remove("napaka");
      });
      napake.forEach(function (n) {
        var polje = document.getElementById(n.polje);
        if (polje) {
          polje.classList.add("napaka");
        }
      });

      var seznam = napake.map(function (n) {
        return "<li>" + n.sporocilo + "</li>";
      }).join("");

      obvestilo({
        icon: "error",
        title: "Preveri vpisane podatke",
        html: '<ul style="text-align:left; margin-left:1.2em;">' + seznam + "</ul>",
        confirmButtonText: "Popravi"
      }).then(function () {
        var polje = document.getElementById(napake[0].polje);
        if (polje) {
          polje.focus();
        }
      });
    }

    document.querySelector("#stran-prijava form").addEventListener("submit", function (e) {
      e.preventDefault();
      var uporabnik = document.getElementById("prijava-up").value.trim();
      var gesloPrijava = document.getElementById("prijava-geslo").value;
      var napake = [];

      if (uporabnik === "") {
        napake.push({ polje: "prijava-up", sporocilo: "Vpiši e-pošto ali uporabniško ime." });
      } else if (uporabnik.indexOf("@") !== -1 && !regEmail.test(uporabnik)) {
        napake.push({ polje: "prijava-up", sporocilo: "E-poštni naslov ni v pravilni obliki." });
      } else if (uporabnik.indexOf("@") === -1 && uporabnik.length < 4) {
        napake.push({ polje: "prijava-up", sporocilo: "Uporabniško ime mora imeti vsaj 4 znake." });
      }

      if (gesloPrijava === "") {
        napake.push({ polje: "prijava-geslo", sporocilo: "Vpiši geslo." });
      } else if (gesloPrijava.length < 8) {
        napake.push({ polje: "prijava-geslo", sporocilo: "Geslo mora imeti vsaj 8 znakov." });
      }

      if (napake.length > 0) {
        prikaziNapake(napake);
        return;
      }

      obvestilo({
        icon: "success",
        title: "Prijava uspešna",
        text: "Dobrodošel nazaj, " + uporabnik + "!",
        timer: 2500,
        timerProgressBar: true
      });
      this.reset();
    });

    document.querySelector("#stran-registracija form").addEventListener("submit", function (e) {
      e.preventDefault();
      var obrazec = this;
      var ime = document.getElementById("ime").value.trim();
      var geslo = document.getElementById("geslo").value;
      var geslo2 = document.getElementById("geslo2").value;

      var priimek = document.getElementById("priimek").value.trim();
      var email = document.getElementById("email").value.trim();
      var uporabnik = document.getElementById("uporabnik").value.trim();
      var rojstvo = document.getElementById("rojstvo").value;
      var pogoji = document.querySelector('input[name="pogoji"]').checked;
      var regIme = /^[\p{L}\s'-]{2,}$/u;
      var napake = [];

      if (!regIme.test(ime)) {
        napake.push({ polje: "ime", sporocilo: "Ime mora imeti vsaj 2 črki in ne sme vsebovati številk." });
      }

      if (!regIme.test(priimek)) {
        napake.push({ polje: "priimek", sporocilo: "Priimek mora imeti vsaj 2 črki in ne sme vsebovati številk." });
      }

      if (!regEmail.test(email)) {
        napake.push({ polje: "email", sporocilo: "E-poštni naslov ni v pravilni obliki (npr. ime@primer.si)." });
      }

      if (!/^[A-Za-z0-9_]{4,}$/.test(uporabnik)) {
        napake.push({ polje: "uporabnik", sporocilo: "Uporabniško ime mora imeti vsaj 4 znake (črke, številke ali podčrtaj)." });
      }

      if (geslo.length < 8 || !/[A-Za-z]/.test(geslo) || !/[0-9]/.test(geslo)) {
        napake.push({ polje: "geslo", sporocilo: "Geslo mora imeti vsaj 8 znakov, vsaj eno črko in eno številko." });
      } else if (geslo !== geslo2) {
        napake.push({ polje: "geslo2", sporocilo: "Gesli se ne ujemata." });
      }

      if (rojstvo === "") {
        napake.push({ polje: "rojstvo", sporocilo: "Vpiši datum rojstva." });
      } else {
        var datum = new Date(rojstvo);
        var danes = new Date();
        var starost = danes.getFullYear() - datum.getFullYear();
        var mesec = danes.getMonth() - datum.getMonth();
        if (mesec < 0 || (mesec === 0 && danes.getDate() < datum.getDate())) {
          starost--;
        }

        if (datum > danes) {
          napake.push({ polje: "rojstvo", sporocilo: "Datum rojstva ne more biti v prihodnosti." });
        } else if (starost < 13) {
          napake.push({ polje: "rojstvo", sporocilo: "Za registracijo moraš imeti vsaj 13 let." });
        }
      }

      if (!pogoji) {
        napake.push({ polje: "pogoji", sporocilo: "Strinjati se moraš s pogoji uporabe." });
      }

      if (napake.length > 0) {
        prikaziNapake(napake);
        return;
      }

      obvestilo({
        icon: "success",
        title: "Račun je ustvarjen!",
        text: "Pozdravljen, " + ime + "! Zdaj se lahko prijaviš.",
        confirmButtonText: "Na prijavo"
      }).then(function () {
        obrazec.reset();
        history.replaceState(null, "", "#prijava");
        pokazi("prijava");
      });
    });

    document.querySelector(".pozabljeno").addEventListener("click", function (e) {
      e.preventDefault();
      obvestilo({
        title: "Pozabljeno geslo",
        text: "Vpiši svojo e-pošto in poslali ti bomo povezavo za ponastavitev.",
        input: "email",
        inputPlaceholder: "janez.novak@primer.si",
        showCancelButton: true,
        confirmButtonText: "Pošlji",
        cancelButtonText: "Prekliči",
        inputValidator: function (vrednost) {
          if (!vrednost) {
            return "Vpiši e-poštni naslov.";
          }
        }
      }).then(function (rezultat) {
        if (rezultat.isConfirmed) {
          obvestilo({
            icon: "success",
            title: "Poslano!",
            text: "Povezavo smo poslali na " + rezultat.value + "."
          });
        }
      });
    });

    var ikonaOko =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

    var ikonaOkoPreckrano =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>' +
      '<line x1="1" y1="1" x2="23" y2="23"/></svg>';

    document.querySelectorAll('input[type="password"]').forEach(function (polje) {
      var ovoj = document.createElement("div");
      ovoj.className = "geslo-ovoj";
      polje.parentNode.insertBefore(ovoj, polje);
      ovoj.appendChild(polje);

      var gumb = document.createElement("button");
      gumb.type = "button";
      gumb.className = "oko";
      gumb.setAttribute("aria-label", "Pokaži geslo");
      gumb.innerHTML = ikonaOko;

      gumb.addEventListener("click", function () {
        var skrito = polje.type === "password";
        polje.type = skrito ? "text" : "password";
        gumb.innerHTML = skrito ? ikonaOkoPreckrano : ikonaOko;
        gumb.setAttribute("aria-label", skrito ? "Skrij geslo" : "Pokaži geslo");
        polje.focus();
      });

      ovoj.appendChild(gumb);
    });

    pokazi(location.hash === "#registracija" ? "registracija" : "prijava");