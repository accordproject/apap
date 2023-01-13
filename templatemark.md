# Agreement Format

## Introduction
Our legal system is based on documents; written in natural language (English, French, Japanese, German etc.). For agreements/contracts to be legally binding it is therefore imperative that the structured data within agreements is embedded within arbitrary natural language.

Note that for the purposes of this document I use the terms agreement, contract and document interchangeably... They all represent a human/legal natural language context for a set of variable values.

### Learn more...
1. What is the difference between agreements and contracts?
2. When do you need a signature?
3. Conga Glossary (Contract/Agreement/Document)

To expose a public REST API for agreements and agreement templates, as well as promote a partner-ecosystem centered around agreements, Accord Project has created a JSON data format for agreements and agreement templates.

Note that this document describes TWO (related) data formats (data models):
1. Template Format
2. Agreement Format (an agreement is an instance of a template)

Given that agreements and agreement templates are intended for both human and machine consumption it is useful to be able to represent agreements using a human readable/editable/diffable format, (eg extended markdown) as well as a machine readable format (eg JSON), with an isomorphic transformation to move between these.

## Semantic Elements of Agreements

First, let’s start by defining the semantic elements of an agreement.

### Plain Text
At the most basic level agreements are expressed as plain text: sequences of Unicode characters, along with markers to escape control characters. 

### Variable Values
Agreements contain embedded variable values (aka “deal points”). It is useful to distinguish variable values from plain text so that variable values can be highlighted, or displayed in summary views.

In the example below, the variable values have been highlighted in bold:

>Basic Compensation. (A) SALARY. The Executive  shall be paid an annual salary of **$230,000.00**, subject to an adjustment as provided below (the "Salary"), which will be payable in equal periodic installments according to the Employer's customary payroll practices, but not less frequently than monthly. The Salary will be reviewed by the Board of Directors not less frequently than annually and may be adjusted upward or downward in the sole discretion of the Board of Directors.

### Formulae Values (Computed Values)
Agreements may contain values that are calculated from variable values (the results of applying a formula to variable values).  In the example below the variable values are highlighted in bold, and the formula value is highlighted in italic.

> Fixed rate loan
This is a fixed interest loan to the amount of **£100,000.00** at the yearly interest rate of **2.5%** with a loan term of **15 years**, and monthly payments of _£667.00_

### Formatted Text
Agreements do not typically require the full layout and formatting features of a word processor, however control of the presentation of the text may be required or desirable for some applications. This may include:

- Bold (strong)
- Italic (emphasis)
- Underline? (BUT read this, and this for a discussion on semantics vs presentation!)
- Superscript?
- Subscript?
- Strikethrough

In addition the font rendering for elements of the agreement should be specifiable via a theme or stylesheet, including setting: 

- Font Face
- Font Color
- Font Size

It is not typically necessary (or desirable) to be able to override font choice within the document itself — instead this should be defined via a CSS-like mechanism that binds semantic elements to display properties. E.g. All H1s should be displayed in Serif Font, Size 32, Bold, Pink. 

### Headings
Agreements typically make extensive use of headings to organize content. Headings are hierarchical: H1, H2, H3, H4, H5, H6 (from markdown) being very common.

### Clause
A clause is an identified part of an agreement; and can be considered a container for a set of paragraphs.

### Header and Footer
Agreements usually require page numbers in footer/header and may sometimes require supplemental information, such as confidentiality, status, file name, logo etc, though this is somewhat controversial.

> TBD how to model this.

### Paragraphs
Text is typically organized into a set of sequential paragraphs, separated by whitespace.

### Whitespace
Whitespace is not typically semantic, instead whitespace is inserted via explicit line-breaks, paragraphs, or page breaks (“thematic breaks”).

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

## Semantic Elements of Agreement Templates
Now, let us turn to the format for an agreement template. Agreement templates are a superset of agreements, in that a (degenerative) agreement template is simply a hardcoded agreement, absent all variables.

> Note: This syntax/semantics is heavily inspired by Handlebars, so you may want to review that.

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

### Formula
Formulae allow the template author to include a dynamically calculated value, calculated from agreement data values.

In the example below the `monthlyPayments` function is being called, passing in three agreement data points for the amount, term and interest rate of a loan. Whenever one of these dependent variables is modified the formula is re-evaluated and a new value is computed.

```
{{#formula monthlyPayments(data.loanAmount, data.loanTerm, data.loanInterestRate) }}
```

> TBD. Define how these formulae are specified and packaged with a template.

### Variable
Simple unary variables are included in templates using a navigation syntax, allowing the template author to navigate through complex types to primitive properties.

```
The seller {{data.seller.name}} hereby agrees to sell {{data.goods}} to {{data.buyer.name}}
```

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
1. CommonMark
1. Accord Project CiceroMark
1. Accord Project TemplateMark
1. Confluence Wiki markup
1. Pandoc