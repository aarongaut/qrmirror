function clearText() {
  const textarea = document.querySelector("#message");
  textarea.value = "";
}

function copyText() {
  const textarea = document.querySelector("#message");
  navigator.clipboard.writeText(textarea.value);
}
