function clearText() {
  const textarea = document.querySelector("#message");
  textarea.innerText = "";
}

function copyText() {
  const textarea = document.querySelector("#message");
  navigator.clipboard.writeText(textarea.innerText);
}
