# Agreement Format

## Introduction
Our legal system is based on documents; written in natural language (English, French, Japanese, German etc.). For agreements/contracts to be legally binding it is therefore imperative that the structured data within agreements is embedded within arbitrary natural language.

Note that for the purposes of this document we use the terms agreement, contract and document interchangeably... They all represent a human/legal natural language context for a set of variable values.

### Learn more...
1. [What is the difference between agreements and contracts?](https://enable.com/blog/agreements-vs-contracts-what-are-the-differences)
2. [When do you need a signature?](https://www.bishopslaw.co.uk/can-an-unsigned-contract-be-enforced-in-uk/)

### Goals
1. To promote a vendor and user ecosystem centered around agreements and templates
1. To facilitate a standard REST API for agreements and templates
1. To promote a vendor ecosystem of agreement and template management and editing tools
1. To future-proof templates and allow templates to be migrated between vendors
1. To provide a "pivot" data format that can be imported from existing document formats (HTML/OOXML/ODF/PDF etc.) or converted to existing document formats (HTML/OOXML/ODF/PDF etc.)

Note that this document describes TWO (related) JSON data formats (data models):
1. Template Format (aka *TemplateMark*)
2. Agreement Format (an agreement is an instance of a template) (aka *AgreementMark*)

Given that agreements and agreement templates are intended for both human and machine consumption it is useful to be able to represent agreements using a human readable/editable/diffable format, (eg extended markdown) as well as a machine readable format (eg JSON), with an isomorphic transformation to move between these.

## Semantic Elements of Agreements (AgreementMark)

First, let’s start by defining the semantic elements of an agreement. 

> Note: both AgreementMark and TemplateMark are specified as [Concerto](https://concerto.accordproject.org) data models and use Concerto JSON serialization.

### Document

The root node of an agreement is the `Document` node. A document node contains a set of child nodes.

### Plain Text
At the most basic level agreements are expressed as plain text: sequences of Unicode characters, along with markers to escape control characters.

Text:

```
This is plain text.
```

JSON AST:

```json
{
  "$class": "org.accordproject.commonmark.Document",
  "nodes": [
    {
      "$class": "org.accordproject.commonmark.Paragraph",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark.Text",
          "text": "This is plain text."
        }
      ]
    }
  ]
}
```

The AST above defines a document containing a single paragraph, which contains a simple plain text string `"This is plain text."`.

> TBD: need to update these examples to use versioned namespaces.

### Variable Values
Agreements contain embedded variable values (aka “deal points”). It is useful to distinguish variable values from plain text so that variable values can be highlighted, or displayed in summary views.

In the example below, the variable values have been highlighted in bold:

>Basic Compensation. (A) SALARY. The Executive  shall be paid an annual salary of **$230,000.00**, subject to an adjustment as provided below (the "Salary"), which will be payable in equal periodic installments according to the Employer's customary payroll practices, but not less frequently than monthly. The Salary will be reviewed by the Board of Directors not less frequently than annually and may be adjusted upward or downward in the sole discretion of the Board of Directors.
 
### Formulae Values (Computed Values)
Agreements may contain values that are calculated from variable values (the results of applying a formula to variable values).  In the example below the variable values are highlighted in bold, and the formula value is highlighted in italic.

> Fixed rate loan
This is a fixed interest loan to the amount of **£100,000.00** at the yearly interest rate of **2.5%** with a loan term of **15 years**, and monthly payments of _£667.00_

### Formatted Text
Agreements do not typically require the full layout and formatting features of a word processor, however control of the presentation of the text may be required or desirable for some applications. This may include:

- Bold ([strong](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong))
- Italic ([emphasis](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em))
- Underline? (BUT read [this](https://talk.commonmark.org/t/feature-request-underline-text/343/8), and [this](https://talk.commonmark.org/t/highlights-strikeout-underlines-spoilers/825) for a discussion on [semantics vs presentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u)!)
- [Superscript?](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup)
- [Subscript?](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub)
- [Strikethrough](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s)

In addition the font rendering for elements of the agreement should be specifiable via a theme or stylesheet, including setting: 

- Font Face
- Font Color
- Font Size

It is not typically necessary (or desirable) to be able to override font choice within the document itself — instead this should be defined via a CSS-like mechanism that binds semantic elements to display properties. E.g. All H1s should be displayed in Serif Font, Size 32, Bold, Pink. 

### Headings
Agreements typically make extensive use of headings to organize content. Headings are hierarchical: H1, H2, H3, H4, H5, H6 (from markdown) being very common.

### Clause
A clause is an [identified part of an agreement](https://dictionary.cambridge.org/dictionary/english/clause); and can be considered a container for a set of paragraphs.

> TBD. Is this the same as a "section"?

### Appendix

Some pages may be tagged as an appendix.

> TBD. More details required.

### Header and Footer
Agreements usually require page numbers in footer/header and may sometimes require supplemental information, such as [confidentiality](https://www.adamsdrafting.com/other-header-and-footer-information/), status, file name, logo etc, though this is somewhat [controversial](https://www.adamsdrafting.com/adding-logos-to-your-contracts/).

> TBD how to model this.

### Paragraphs
Text is typically organized into a set of sequential paragraphs, separated by whitespace.

### Whitespace
Whitespace is not typically semantic, instead whitespace is inserted via explicit line-breaks, paragraphs, or page breaks ([“thematic breaks”](https://spec.commonmark.org/0.30/#thematic-breaks)).

### Images/Diagrams
Agreements often include images, pictures or diagrams to illustrate products, instructions or business processes. Images should be referenced within the text of the agreement. 

Note: There are security (CORS) issues with referencing external images from web apps. 

See: https://spec.commonmark.org/0.30/#images

![foo](/url "title")

### Links
Agreements frequently contain hyperlinks to external content.

See: https://spec.commonmark.org/0.30/#links

[link](/uri "title")

### Pages
Agreements often include explicit page breaks to force content onto a new page, to improve readability or organization. How “pages” are rendered on a mobile device or in a responsive web-browser will vary based on UX considerations. Note that the CommonMark specification therefore refers to these as “thematic breaks”, rather than “page breaks” — because the intent is to insert a switch of theme, rather than necessarily control a printer head and the motors controlling paper advance.

### Lists
Most agreements include lists in some form, and some contracts are purely composed of lists and nested lists, ensuring that every element is identified via a unique list path, such as element “1.3.4”, for example.

Lists numbering may be specified as roman, numeric, alphanumeric or unordered (bullets).

### Tables
Many agreements include tables, used to display sets of related data in compact form. For example, for product details, contact details, pricing tables, discount tables, or compensation amounts.

### References
Agreement text often includes references to semantic elements from within the same agreement, or to other agreements, contracts or documents. Examples:
- As defined in Warranty Clause
- See pricing defined in section 2.3.5
- Defined in Appendix 3
- As specified in image 4.

See https://spec.commonmark.org/0.30/#link-reference-definitions

### Annotations / Insights
It is useful to be able to wrap semantic elements in an annotation, to indicate for example that a sentence represents high risk, or that a paragraph appears to be an instance of a type of clause. In many cases these annotations would be the result of running a machine-learning algorithm over the source text of the agreement.

Other types of annotations could include comments from human reviewers.

## Semantic Elements of Agreement Templates (TemplateMark)
Now, let us turn to the format for an agreement template. Agreement templates are a superset of agreements, in that a (degenerative) agreement template is simply a hardcoded agreement, absent all variables.

There are **many** commercial products for producing agreements from templates (see *Additional Resources* for a selection). Most are broadly similar in terms of features and semantics, however there is no universally adopted system for exchanging templates, which has resulted in a fragmented eco-system and issues of vendor lock-in, and lack of future-proofing the (considerable) investment required to build templates.

A template is expressed as natural-language with embedded variables and template expressions. Template variables are named and rely on an associated [Concerto](https://concerto.accordproject.org) model (type-system).

For example, the trivial template:

```
Hello {{firstName}}!
```

Has a single named variable `firstName` and an associated **template model** that specifies that `firstName` is of type `String`:

```
concept TemplateModel {
    o String firstName
}
```

The template model is critical in ensuring that variable values conform to the model, as well as providing the basis for downstream processing of agreement data, charts, reporting and a guided user-experience when supplying variable values.

> Note: This example syntax/semantics for tempates is heavily inspired by [Handlebars](https://handlebarsjs.com/guide/builtin-helpers.html), so you may want to review that.

### Template Safety
An explicit goal of the agreement template format is that we should be able to statically validate (potentially compile) the logic of a template, ensuring that all variable references and formula usage is valid and that if the template is presented with valid data it is guaranteed to produce valid output. This contrasts with many current template technologies which fail in unpredictable ways, due to bugs in the template syntax/expressions, or invalid assumptions about the shape of incoming data. For example, if a contract attribute has been marked as optional the template must include appropriate guards to handle cases where the contract attribute is missing.

### Conditional Section
Most agreement templates require conditional sections, i.e. sections that should only be included based on the values of variables, for example, including a clause specific to an extended warranty.

Conceptually, these are of the form:

```
{{#if data.variable==”value”}}
Insert this content
{{else}}
Otherwise include this content.
{{/if}}
```

### Switch Section

For more complex multi-valued inclusion of content a `switch` statement is useful:

```
{{#switch data.color}}
{{case Color.RED}}
Insert this content for red.
{{/case}}
{{case Color.BLUE}}
Include this content for blue.
{{/case}}
{{default}}
Otherwise include this content.
{{/default}}
{{/if}}
```

### Dynamic Template Insertion
In advanced scenarios it is not practical to package all content within a single template, because content needs to be managed, shared and reused across many templates. In those scenarios the template author should dynamically resolve and include those sub-templates, often based upon variable values that are in scope.

The example below is dynamically including agreement templates from a logical template store called `hr_clauses` where the `jurisdiction_name` property of the template is equal to the `jurisdiction` variable value, and the `status` property equals the string `“active”`.

The query string is a SQL-like dialect to select templates based on their properties, comparing their properties with hardcoded values, or with variable values in context.

```
{{#insert hr_clauses where jurisdiction_name=data.jurisdiction and status=”active”}}
```

> Note: see [Handlebars "Partials"](https://handlebarsjs.com/guide/partials.html)

### Formula
Formulae allow the template author to include a dynamically calculated value, calculated from agreement data values.

In the example below an inline JS expression is being called. The JS expresson is evaluated, and the expression return value is inlined into the AgreementMark document.

```
Hello {{data.firstName}}{{#if data.lastName && data.lastName !== 'Selman'}} {{data.lastName}}{{/if}}!

Thank you for visiting us {{%const difference = now.getTime() - data.lastVisit.getTime();return Math.ceil(difference / (1000 * 3600 * 24));%}} days ago.
```

> TBD. Can external libraries or functions be called?

### Variable
Simple unary variables are included in templates using a navigation syntax, allowing the template author to navigate through complex types to primitive properties.

```
The seller {{data.seller.name}} hereby agrees to sell {{data.goods}} to {{data.buyer.name}}
```

Text:

```
Hello {{firstName}}!
```

Model:

```
namespace test

@template
concept TemplateModel {
    o String firstName
}
```

JSON AST:

```
{
  "$class": "org.accordproject.commonmark.Document",
  "xmlns": "http://commonmark.org/xml/1.0",
  "nodes": [
    {
      "$class": "org.accordproject.templatemark.ClauseDefinition",
      "name": "top",
      "elementType": "test.TemplateModel",
      "nodes": [
        {
          "$class": "org.accordproject.commonmark.Paragraph",
          "nodes": [
            {
              "$class": "org.accordproject.commonmark.Text",
              "text": "Hello "
            },
            {
              "$class": "org.accordproject.templatemark.VariableDefinition",
              "name": "firstName",
              "elementType": "String"
            },
            {
              "$class": "org.accordproject.commonmark.Text",
              "text": "!"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Assigning Variables to Recipients

A variable may be associated with a recipient, indicating that the variable value must be supplied by a specific role (user) of the template. For example, a recipient role might be "buyer" and another role might be "seller", with variables for `buyer address` and `seller address` with the respective recipient association.

#### Variable Formatting
Properties that are not strings may optionally be formatted. For example, monetary amounts may include currency code, currency symbol, floating point numbers may include precision, dates/times are converted to human readable localized display strings.

For example, the syntax below formats a monetary amount using a currency symbol and two significant digits or numeric precision.

```
The agreed purchase price of the goods is {{data.purchasePrice as “K00.00”}}
```

#### Nary Variable

Nary variables (lists) must be expanded/iterated to be inserted into a template. A list variable can be either expanded as a list or as a table.

##### List Expansion

```
Patient {{data.patient.name}} declares the following allergies:
{{#each data.patient.allergies}}
{{this.name}}
{{/each}}
```

##### Table Expansion

```
Patient {{data.patient.name}} declares the following allergies:

| Allergy Name | Severity |
|--------------|----------|
{{#each data.patient.allergies}}
| {{this.name}}|{{this.severity}}|
{{/each}}
```

> TBD: Include a sample that shows conditional inclusion of rows?

##### List Navigation

```
The first seller {{data.seller[0].name}} hereby agrees to sell {{data.goods}} to the first buyer {{data.buyers[0].name}}
```

### Navigation

The `with-helper` allows you to change the evaluation context of template-part. In the example below the reference to `data.person.firstname` and `data.person.lastname` is simplified by first binding `data.person` to the current context.

```
{{#with data.person}}
{{firstname}} {{lastname}}
{{/with}}
```

### Dynamic Content
Dynamic content may be included in a template by using a formula that returns formatted text, or even a template.

> Details TBD, but likely if the formula function returns a JSON Object (AST) rather than a primitive then we can assume it is a template or rich-text content

## Additional Resources
1. [CommonMark](https://docs.accordproject.org/docs/markup-commonmark.html)
1. Accord Project [CiceroMark](https://docs.accordproject.org/docs/markup-ciceromark.html)
1. Accord Project [TemplateMark](https://docs.accordproject.org/docs/markup-templatemark.html)
1. [Confluence Wiki markup](https://confluence.atlassian.com/doc/confluence-wiki-markup-251003035.html)
1. [Pandoc](https://pandoc.org/MANUAL.html#pandocs-markdown)
1. [Open Office XML](http://officeopenxml.com/WPtext.php)
1. [Open Document Format 1.2](http://docs.oasis-open.org/office/v1.2/OpenDocument-v1.2.pdf)
1. [Open Document OpenFormula 1.2](http://docs.oasis-open.org/office/v1.2/OpenDocument-v1.2.pdf)
1. [Formula.js](https://formulajs.info/)

## Document Automation / Generation Vendors

> Pull requests with additional vendors welcome!

### Open Souce

1. [Docassemble](https://docassemble.org)
1. [M2Doc](https://www.m2doc.org)

### Commercial

1. [Bryter](https://help.bryter.io/hc/en-us/articles/4417166695569-Elevate-documents-with-conditional-content-using-if-condition-name-and-endif-condition-name-)
1. [Lawmatics](https://help.lawmatics.com/article/358-types-of-lawmatics-documents-and-when-to-use-each)
1. [Formstack / Web Merge](https://www.formstack.com/products/documents)
1. [Insightly](https://support.insight.ly/en-US/Knowledge/article/1397/How_to_use_Microsoft_Word_to_add_conditional_merge_statements_into_templates/)
1. [Google AppSheet](https://support.google.com/appsheet/answer/11568425?hl=en&ref_topic=11445504)
1. [Pandadoc](https://support.pandadoc.com/hc/en-us/articles/4423209193367-Conditional-smart-content-for-senders-#h_01FVJDX1FG84F1BDPWCABBZ52M)
1. [Hotdocs Conditional Regions](https://help.hotdocs.com/author/current/Conditional_Region_Overview.htm) / [Hotdocs Fields](https://help.hotdocs.com/author/current/HotDocs_Fields_Overview.htm)
1. [Pathagoras](https://www.pathagoras.com/help/index.html?nested_variables.htm)
1. [Docmosis](https://www.docmosis.com)
1. [Conga Composer](https://conga.com/products/conga-composer)
1. [Docupilot](https://docupilot.app)
1. [PleoDox](https://pleodox.com)
1. [Templafy](https://www.templafy.com)
1. [Legito](https://www.legito.com)
1. [DocuPrime](https://www.docuprime.io)
1. [DocuSign](https://www.docusign.com/products/gen)
1. [Opero](https://www.opero.com)
1. [ActiveDocs](https://www.activedocs.com)
1. [dox42](https://www.dox42.com)
1. [VisiRule](https://www.visirule.co.uk)
1. [Zapier + GSuite](https://zapier.com/blog/create-autopopulate-google-docs-template/)
1. [Plumsail](https://plumsail.com/documents/)
1. [JotForm](https://www.jotform.com/what-is-document-automation/)