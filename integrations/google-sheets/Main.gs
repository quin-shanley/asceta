/** @OnlyCurrentDoc */

// The onOpen function is all you need to copy to another Apps Script to use Asceta
function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu("Template")
  .addItem("Render template", "Asceta.renderPreviewDialog")
  .addToUi();
}
