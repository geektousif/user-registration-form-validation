let nameEl = document.getElementById("name");
let emailEl = document.getElementById("email");
let phoneEl = document.getElementById("phone");
let ageEl = document.getElementById("age");
let dobEl = document.getElementById("dob");
const userTable = document.getElementById("userTable");
const form = document.getElementById("form");

let usersList = [];

let userObject = {};

document.addEventListener("DOMContentLoaded", () => {
  let keys = Object.keys(localStorage);
  let i = keys.length;

  while (i--) {
    usersList.push(JSON.parse(localStorage.getItem(keys[i])));
  }

  usersList.forEach((user) => {
    let newrow = `
      <tr class="border-b">
      <td
        class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
      >
        ${user.name}
      </td>
      <td
        class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
      >
      ${user.email}
      </td>
      <td
        class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
      >
      ${user.phone}
      </td>
      <td
        class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
      >
      ${user.dateOfBirth}
      </td>
    </tr>
      `;
    userTable.innerHTML += newrow;
    console.log(user);
  });
});

const requiredValidation = (text) => (text === "" ? false : true);

const lengthValidation = (len, max, min) =>
  len < min || len > max ? false : true;

const showError = (inputEle, message) => {
  const field = inputEle.parentElement;

  field.querySelector("#error").innerHTML = message;
};

const removeError = (inputEle) => {
  const field = inputEle.parentElement;
  field.querySelector("#error").innerHTML = "";
};

const nameValidation = () => {
  let correct = false;
  const name = nameEl.value.trim();

  if (!requiredValidation(name)) {
    showError(nameEl, "Name is required");
  } else if (!lengthValidation(name.length, 20, 3)) {
    showError(nameEl, "Name must be between 3 and 20 characters");
  } else {
    removeError(nameEl);
    userObject = { ...userObject, name: name };
    correct = true;
  }

  return correct;
};

const emailValidation = () => {
  let correct = false;
  const email = emailEl.value.trim();
  let keys = Object.keys(localStorage);

  if (!requiredValidation(email)) {
    showError(emailEl, "email is required");
  } else if (keys.includes(email)) {
    showError(emailEl, "Email already exists, Enter unique email");
  } else {
    removeError(emailEl);
    userObject = { ...userObject, email: email };
    correct = true;
  }

  return correct;
};

const phoneValidation = () => {
  let correct = false;
  const phone = phoneEl.value.trim();

  if (phone.length > 0 && phone.length !== 10) {
    showError(phoneEl, "phone must be 10 numbers");
  } else {
    removeError(phoneEl);

    userObject = { ...userObject, phone: phone };
    correct = true;
  }

  return correct;
};

const calculateAge = (dobInput) => {
  const dob = new Date(dobInput);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

dobEl.addEventListener("input", () => {
  ageEl.value = calculateAge(dobEl.value);
});

const dobValidation = () => {
  let correct = false;
  const age = calculateAge(dobEl.value);

  if (dobEl.value === "") {
    showError(dobEl, "Enter Date of Birth");
  } else if (age < 18) {
    showError(dobEl, "Age must be greater than or equal to 18");
  } else {
    removeError(dobEl);
    userObject = { ...userObject, dateOfBirth: dobEl.value };
    correct = true;
  }

  return correct;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let nameValid = nameValidation(),
    emailValid = emailValidation(),
    phoneValid = phoneValidation(),
    dobValid = dobValidation();

  let isFormValid = nameValid && emailValid && phoneValid && dobValid;

  if (isFormValid) {
    usersList.push(JSON.stringify(userObject));
    localStorage.setItem(userObject.email, JSON.stringify(userObject));
    // let row = userTable.insertRow(-1);
    // const nameCell = row.insertCell(0);
    // nameCell.innerHTML = userObject.name;
    // const emailCell = row.insertCell(1);
    // emailCell.innerHTML = userObject.email;
    // const phoneCell = row.insertCell(2);
    // phoneCell.innerHTML = userObject.phone;
    // const dobCell = row.insertCell(3);
    // dobCell.innerHTML = userObject.phone;

    let newrow = `
        <tr class="border-b">
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
          ${userObject.name}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
        ${userObject.email}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
        ${userObject.phone}
        </td>
        <td
          class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
        >
        ${userObject.dateOfBirth}
        </td>
      </tr>
        `;
    userTable.innerHTML += newrow;

    nameEl.value = "";
    emailEl.value = "";
    phoneEl.value = "";
    dobEl.value = "";
    userObject = {};
  }
});
