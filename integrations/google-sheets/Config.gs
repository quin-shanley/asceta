function getDialogSize_() {
  const p = PropertiesService.getScriptProperties();
  return {
    width: Number(p.getProperty("rendererDialogWidth")) || 700,
    height: Number(p.getProperty("rendererDialogHeight")) || 560,
  };
}
