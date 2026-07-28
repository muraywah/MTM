const modalBg = document.getElementById("modalBg");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const amount = document.getElementById("amount");
const toast = document.getElementById("toast");

let selectedService = "";

function openModal(name, price) {
  selectedService = name;
  modalTitle.textContent = name;

  if (price) {
    modalText.textContent = `You selected ${name} for ₦${Number(price).toLocaleString()}.`;
    amount.style.display = "none";
  } else {
    modalText.textContent = `Enter an amount to continue with ${name}.`;
    amount.style.display = "block";
    amount.value = "";
  }

  modalBg.classList.add("show");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

document.querySelectorAll("[data-service]").forEach(button => {
  button.addEventListener("click", () => openModal(button.dataset.service));
});

document.querySelectorAll("[data-bundle]").forEach(button => {
  button.addEventListener("click", () => {
    openModal(`${button.dataset.bundle} data`, button.dataset.price);
  });
});

document.getElementById("confirm").addEventListener("click", () => {
  if (amount.style.display !== "none" && !amount.value) {
    showToast("Enter an amount first.");
    return;
  }

  modalBg.classList.remove("show");
  showToast(`${selectedService} completed successfully.`);
});

modalBg.addEventListener("click", event => {
  if (event.target === modalBg) modalBg.classList.remove("show");
});

document.getElementById("bell").addEventListener("click", () => {
  showToast("You have a new weekend data offer.");
});
