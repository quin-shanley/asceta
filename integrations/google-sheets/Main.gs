/** @OnlyCurrentDoc */

function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu("Template")
  .addItem("Render template", "Asceta.renderPreviewDialog")
  .addToUi();
}
