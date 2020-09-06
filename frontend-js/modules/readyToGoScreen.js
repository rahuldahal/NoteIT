import axios from "axios";
import { saveAvailableNotes } from "./localStorageHandler";

export default class ReadyToGo {
  constructor() {
    console.log("I am running...readyToGo");
    this._csrf = document.querySelector('[name="_csrf"]').value;
    this.form = document.getElementById("readyToGoForm");
    this.events();
  }

  events() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      axios
        .post("/users/sendNotesToClient", { _csrf: this._csrf })
        .then((notes) => saveAvailableNotes(notes.data))
        .catch((error) => console.log(error));
    });
  }
}
