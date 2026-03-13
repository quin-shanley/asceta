function loadTemplater() {
  createMenu();
}

function createMenu() {
  SpreadsheetApp.getUi()
  .createMenu("Template")
  .addItem("Render template", "renderPreviewDialog")
  .addToUi();
}

function renderPreviewDialog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const range = SpreadsheetApp.getActiveRange();

  const template = getTemplate(range);

  const html = renderTemplateToHtml_(ss, sheet, template);

  const dialogSize = getDialogSize_();
  showPreviewDialog_(html, dialogSize);
}

function getTemplate(range) {
  if (!range || range.getNumRows() !== 1 || range.getNumColumns() !== 1) {
    SpreadsheetApp.getUi().alert(
      "Please select a single cell that contains the template."
    );
    return;
  }

  return String(range.getDisplayValue() ?? "");
}

function showPreviewDialog_(renderedHtml, dialogSize) {
  const t = HtmlService.createTemplateFromFile("PreviewDialog");
  t.previewHtml = renderedHtml;

  const dialog = t.evaluate()
    .setWidth(dialogSize.width)
    .setHeight(dialogSize.height);

  SpreadsheetApp.getUi().showModalDialog(dialog, "Preview");
}
