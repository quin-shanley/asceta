function renderTemplateToHtml_(ss, sheet, template) {
  const asciidoctor = Asceta.Asciidoctor;
  const eta = new Asceta.Eta({autoTrim: false});

  // Resolve all reference placeholders found in the template
  const resolvedRefs = resolveTemplateRefs_(ss, sheet, template);

  // Render the Ascii
  const adoc = eta.renderString(template, resolvedRefs);

  // Convert AsciiDoc to HTML
  const html = asciidoctor.convert(adoc);

  return html;
}
